<script setup lang="ts">
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { onMounted, watch } from "vue";

import General from "./components/general/index.vue";

import UpdateApp from "@/components/update-app/index.vue";
import { useTray } from "@/composables/useTray";
import { t } from "@/locales";
import { useGeneralStore } from "@/stores/general";
import { isMac } from "@/utils/platform";

const { createTray } = useTray();
const generalStore = useGeneralStore();
const appWindow = getCurrentWebviewWindow();

onMounted(async () => {
	createTray();
});

watch(
	() => generalStore.appearance.language,
	() => {
		appWindow.setTitle(t("pages.preference.title"));
	},
	{ immediate: true },
);
</script>

<template>
	<div class="flex h-screen">
		<div
			class="flex-1 overflow-auto bg-color-8 dark:bg-color-2 p-4"
			:class="[isMac ? 'pt-8' : '']"
			data-tauri-drag-region
		>
			<General />
		</div>
	</div>

	<UpdateApp />
</template>
