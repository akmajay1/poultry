import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

<<<<<<< HEAD
// Import translations
import enTranslations from './locales/en/translation.json';
import hiTranslations from './locales/hi/translation.json';

=======
>>>>>>> f1d4b1cd680778c7dce4715017eec8b86464ec58
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
<<<<<<< HEAD
        translation: enTranslations
      },
      hi: {
        translation: hiTranslations
      }
    },
    lng: 'en', // default language
=======
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
>>>>>>> f1d4b1cd680778c7dce4715017eec8b86464ec58
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

<<<<<<< HEAD
export default i18n; 
=======
export default i18n;
>>>>>>> f1d4b1cd680778c7dce4715017eec8b86464ec58
