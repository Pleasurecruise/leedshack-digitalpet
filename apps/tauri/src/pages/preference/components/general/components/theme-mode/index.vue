<script setup lang="ts">
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@my-monorepo/ui/select";
import { onMounted, watch } from "vue";

import ProListItem from "@/components/pro-list-item/index.vue";
import { useGeneralStore } from "@/stores/general";

const generalStore = useGeneralStore();
const appWindow = getCurrentWebviewWindow();

onMounted(() => {
	appWindow.onThemeChanged(async ({ payload }) => {
		if (generalStore.appearance.theme !== "auto") return;

		generalStore.appearance.isDark = payload === "dark";
	});
});

watch(
	() => generalStore.appearance.theme,
	async (value) => {
		let nextTheme = value === "auto" ? null : value;

		await appWindow.setTheme(nextTheme);

		nextTheme = nextTheme ?? (await appWindow.theme());

		generalStore.appearance.isDark = nextTheme === "dark";
	},
	{ immediate: true },
);

watch(
	() => generalStore.appearance.isDark,
	(value) => {
		if (value) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	},
	{ immediate: true },
);
</script>

<template>
	<ProListItem :title="$t('pages.preference.general.labels.themeMode')">
		<Select v-model="generalStore.appearance.theme">
			<SelectTrigger class="w-36" />
			<SelectContent>
				<SelectItem value="auto">
					{{ $t("pages.preference.general.options.auto") }}
				</SelectItem>
				<SelectItem value="light">
					{{ $t("pages.preference.general.options.lightMode") }}
				</SelectItem>
				<SelectItem value="dark">
					{{ $t("pages.preference.general.options.darkMode") }}
				</SelectItem>
			</SelectContent>
		</Select>
	</ProListItem>
</template>
