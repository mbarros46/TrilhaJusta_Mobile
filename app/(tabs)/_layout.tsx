// @ts-ignore - Tabs existe em tempo de execução
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import { IconSymbol } from '../../components/ui/IconSymbol';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '../../constants/Colors';

const DashboardIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="house.fill" color={color} />
);

const TrilhasIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="list.bullet.rectangle" color={color} />
);

const VagasIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="briefcase.fill" color={color} />
);

const PerfilIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="person.crop.circle" color={color} />
);

const SobreIcon = ({ color }: { color: string }) => (
  <IconSymbol size={28} name="info.circle" color={color} />
);

export default function TabsLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const tintColor = Colors[colorScheme].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <DashboardIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="trilhas"
        options={{
          title: 'Trilhas',
          tabBarIcon: ({ color }) => <TrilhasIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="vagas"
        options={{
          title: 'Vagas',
          tabBarIcon: ({ color }) => <VagasIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <PerfilIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color }) => <SobreIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
