import type { Theme } from "@tauri-apps/api/window";

import { defineStore } from "pinia";
import { getLocale } from "tauri-plugin-locale-api";
import { reactive } from "vue";

import { LANGUAGE } from "@/core/constants";

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

export interface GeneralStore {
	app: {
		autostart: boolean;
		taskbarVisible: boolean;
	};
	appearance: {
		theme: "auto" | Theme;
		isDark: boolean;
		language?: Language;
	};
	update: {
		autoCheck: boolean;
	};
}

export const useGeneralStore = defineStore("general", () => {
	const app = reactive<GeneralStore["app"]>({
		autostart: false,
		taskbarVisible: false,
	});

	const appearance = reactive<GeneralStore["appearance"]>({
		theme: "auto",
		isDark: false,
	});

	const update = reactive<GeneralStore["update"]>({
		autoCheck: false,
	});

	const normalizeLanguage = (locale?: string | null): Language => {
		if (!locale) return LANGUAGE.EN;

		if (Object.values(LANGUAGE).includes(locale as Language)) {
			return locale as Language;
		}

		const lower = locale.toLowerCase();

		if (lower.startsWith("zh")) return LANGUAGE.ZH;
		if (lower.startsWith("en")) return LANGUAGE.EN;

		return LANGUAGE.EN;
	};

	const init = async () => {
		const locale = await getLocale<string>();
		const nextLanguage = normalizeLanguage(appearance.language ?? locale);

		appearance.language = nextLanguage;
	};

	return {
		app,
		appearance,
		update,
		init,
	};
});
