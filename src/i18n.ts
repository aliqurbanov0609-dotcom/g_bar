import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import az from './locales/az.json';

const resources = {
  ru: { translation: ru },
  az: { translation: az },
};

const savedLang = localStorage.getItem('appLang');
let defaultLang = 'ru';

if (savedLang) {
  defaultLang = savedLang;
} else {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang === 'az' || browserLang.startsWith('az-')) {
    defaultLang = 'az';
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
