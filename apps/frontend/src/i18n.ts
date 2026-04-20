import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages /en.json";
import es from "./languages /es.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: "en",
  fallbackLng: "en",
});

export default i18n;
