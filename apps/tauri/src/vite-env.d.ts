/// <reference types="vite/client" />

import type { TranslationKey } from "@my-monorepo/i18n";

declare module "vue" {
	interface ComponentCustomProperties {
		$t: (key: TranslationKey) => string;
	}
}

declare module "*.vue" {
	import type { DefineComponent } from "vue";

	const component: DefineComponent<object, object, any>;
	export default component;
}
