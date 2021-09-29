import en from "./en.json";
import es from "./es.json";
import ru from "./ru.json";
import vi from "./vi.json";

export default {
  locales: { en, es, ru, vi },
  setup(i18n) {
    Object.keys(this.locales).forEach((locale) => {
      i18n.add(locale, this.locales[locale]);
    });

    i18n.set('en');
    i18n.fallback('en');
  }
}