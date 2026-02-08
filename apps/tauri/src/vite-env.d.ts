/// <reference types="vite/client" />

import type { TranslationKey } from "@my-monorepo/i18n";

declare module "vue" {
	interface ComponentCustomProperties {
		$t: (key: TranslationKey) => string;
	}
}
