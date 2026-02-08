import { I18n } from "i18n-js";
import type { SupportedLanguage } from "./types";
import en from "./locales/en";
import zh from "./locales/zh";

const resources = {
	en,
	zh,
};

const i18n = new I18n(resources);

i18n.locale = "en";
i18n.defaultLocale = "en";
i18n.enableFallback = true;

export { i18n };

export async function changeLanguage(lang: SupportedLanguage) {
	i18n.locale = lang;
	return i18n.locale as SupportedLanguage;
}

export function getCurrentLanguage(): SupportedLanguage {
	return i18n.locale as SupportedLanguage;
}
