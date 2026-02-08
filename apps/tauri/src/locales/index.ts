import type { TranslationKey } from "@my-monorepo/i18n";
import type { App, Plugin } from "vue";

import { ref } from "vue";

import { changeLanguage, getCurrentLanguage, t as baseT } from "@my-monorepo/i18n";

import type { Language } from "@/stores/general";

const locale = ref<Language>(getCurrentLanguage());

export async function setLocale(language: Language) {
	await changeLanguage(language);
	locale.value = language;
}

export function t(key: TranslationKey) {
	locale.value;
	return baseT(key);
}

export const i18n: Plugin = {
	install(app: App) {
		app.config.globalProperties.$t = t;
	},
};

export { locale };
