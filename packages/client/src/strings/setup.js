import en from "./en.json";
import es from "./es.json";
import ru from "./ru.json";
import vi from "./vi.json";

export default {
  locales: { en, ru, vi },
  setup(i18n) {
    Object.keys(this.locales).forEach((locale) => {
      i18n.add(locale, this.locales[locale]);
    });

    let manualLocale = localStorage.getItem('locale');
    let browserLocale = (navigator.language || navigator.userLanguage || 'en-Us').split('-')[0];

    i18n.set(manualLocale || browserLocale);
    i18n.fallback('en');
  }
};
