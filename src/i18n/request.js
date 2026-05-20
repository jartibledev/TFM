import { getRequestConfig } from 'next-intl/server';
// 1. Importamos los JSON de forma estática (así Turbopack no puede fallar ni cachear mal)
import esMessages from '../../messages/es.json';
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';
import deMessages from '../../messages/de.json';

const messageMap = {
  es: esMessages,
  en: enMessages,
  fr: frMessages,
  de: deMessages
};

export default getRequestConfig(async ({ locale }) => {
  const locales = ['es', 'en', 'fr', 'de'];
  const currentLocale = locales.includes(locale) ? locale : 'es';

  return {
    locale: currentLocale,
    // 2. Le asignamos directamente el objeto ya importado
    messages: messageMap[currentLocale] || esMessages
  };
});