import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './ru.js';

const initI18n = async () => {
  await i18next
    .use(initReactI18next)
    .init({
      resources: {
        ru: { translation: ru.translation },
      },
      lng: 'ru',
      fallbackLng: 'ru',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
    });
};

export default initI18n;
