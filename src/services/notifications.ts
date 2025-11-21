import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t, getAppLang } from '../i18n';

const PUSH_TOKEN_KEY = '@FleetZone:pushToken';

export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      throw new Error('Push notifications require a physical device');
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted');
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    // Configure Android notification channel for production builds
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
          lightColor: '#FF231F7C',
        });
      } catch (e) {
        // non-fatal, channel creation might fail on older Android versions
        console.warn('Failed to create notification channel', e);
      }
    }
    return token;
  } catch (err) {
    throw err;
  }
}

export async function getSavedPushToken() {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

// Envia uma notificação de teste usando o serviço de push do Expo.
// Observação: em produção, o envio deve ser feito via servidor com credenciais.
export async function sendTestPushNotification(expoPushToken?: string) {
  const token = expoPushToken ?? (await getSavedPushToken());
  if (!token) throw new Error('No push token available');
  const lang = await getAppLang();

  const message = {
    to: token,
    sound: 'default',
    title: t('test_notification_title', lang),
    body: t('test_notification_body', lang),
    data: { test: true },
    android: {
      channelId: 'default',
      sound: 'default'
    }
  } as any;

  // Expo push endpoint
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to send push: ${text}`);
  }

  return response.json();
}
