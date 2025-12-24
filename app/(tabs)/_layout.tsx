import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.tabs.today'),
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              <IconSymbol size={28} name="house.fill" color={color} />
            ) : (
              <Ionicons name="home" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t('common.tabs.stats'),
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              <IconSymbol size={28} name="chart.bar.fill" color={color} />
            ) : (
              <Ionicons name="stats-chart" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('common.tabs.history'),
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              <IconSymbol size={28} name="calendar" color={color} />
            ) : (
              <Ionicons name="calendar" size={24} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('common.tabs.settings'),
          tabBarIcon: ({ color }) =>
            Platform.OS === 'ios' ? (
              <IconSymbol size={28} name="gearshape.fill" color={color} />
            ) : (
              <Ionicons name="settings" size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
