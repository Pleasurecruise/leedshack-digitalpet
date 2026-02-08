import type { WindowState } from "@/composables/useWindowState";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAppStore = defineStore("app", () => {
	const windowState = reactive<WindowState>({});

	return {
		windowState,
	};
});
