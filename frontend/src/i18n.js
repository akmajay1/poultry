import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to Shree Pratap Poultry Farm',
          login: 'Login',
          email: 'Email',
          password: 'Password',
          submit: 'Submit',
          forFarmers: 'For Farmers',
          forAdmins: 'For Administrators',
          getStarted: 'Get Started',
          farmersDesc: 'Track chick mortality rates, submit daily proofs, and manage your poultry operations efficiently.',
          adminsDesc: 'Monitor business metrics, manage invoices, and oversee farm operations through our comprehensive dashboard.'
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;