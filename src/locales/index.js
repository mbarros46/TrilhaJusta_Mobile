import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pt from './pt.json';
import es from './es.json';

const STORAGE_KEY = 'userLang';

async function init() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const initial = stored ?? (Localization.locale && Localization.locale.startsWith('es') ? 'es' : 'pt');

    i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v3',
        lng: initial,
        fallbackLng: 'pt',
        resources: {
          pt: { translation: pt },
          es: { translation: es },
        },
        interpolation: { escapeValue: false },
      });

    i18n.on('languageChanged', async (lng) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, lng);
      } catch (e) {
        // ignore
      }
    });
  } catch (err) {
    // fallback init
    i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v3',
        lng: Localization.locale && Localization.locale.startsWith('es') ? 'es' : 'pt',
        fallbackLng: 'pt',
        resources: {
          pt: { translation: pt },
          es: { translation: es },
        },
        interpolation: { escapeValue: false },
      });
  }
}

init();

export default i18n;
