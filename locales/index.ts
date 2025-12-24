/**
 * i18n 国际化配置
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en';
import zh from './zh';

const LANGUAGE_STORAGE_KEY = 'app_language';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

/**
 * 获取系统语言
 */
const getSystemLanguage = (): string => {
  const systemLocale = Localization.getLocales()[0];
  const languageCode = systemLocale?.languageCode || 'en';

  // 中文系统使用中文
  if (languageCode.startsWith('zh')) {
    return 'zh';
  }

  // 其他语言默认英文
  return 'en';
};

/**
 * 初始化语言
 */
const initLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && savedLanguage !== 'system') {
      return savedLanguage;
    }
  } catch (error) {
    console.error('Failed to load saved language:', error);
  }
  return getSystemLanguage();
};

// 初始化 i18n
i18n.use(initReactI18next).init({
  resources,
  lng: getSystemLanguage(), // 先使用系统语言
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

// 异步加载保存的语言设置
initLanguage().then((lang) => {
  if (lang !== i18n.language) {
    i18n.changeLanguage(lang);
  }
});

/**
 * 切换语言
 */
export const changeLanguage = async (language: 'system' | 'en' | 'zh'): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    const targetLang = language === 'system' ? getSystemLanguage() : language;
    await i18n.changeLanguage(targetLang);
  } catch (error) {
    console.error('Failed to change language:', error);
  }
};

/**
 * 获取当前语言设置
 */
export const getCurrentLanguageSetting = async (): Promise<'system' | 'en' | 'zh'> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'en' || savedLanguage === 'zh') {
      return savedLanguage;
    }
  } catch (error) {
    console.error('Failed to get language setting:', error);
  }
  return 'system';
};

export default i18n;
