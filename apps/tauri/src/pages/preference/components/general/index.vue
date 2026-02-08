<script setup lang="ts">
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { Switch } from "@my-monorepo/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@my-monorepo/ui/select";
import { watch } from "vue";

import ThemeMode from "./components/theme-mode/index.vue";

import ProList from "@/components/pro-list/index.vue";
import ProListItem from "@/components/pro-list-item/index.vue";
import { useGeneralStore } from "@/stores/general";

const generalStore = useGeneralStore();

watch(
	() => generalStore.app.autostart,
	async (value) => {
		const enabled = await isEnabled();

		if (value && !enabled) {
			return enable();
		}

		if (!value && enabled) {
			disable();
		}
	},
	{ immediate: true },
);
</script>

<template>
	<ProList :title="$t('pages.preference.general.labels.appSettings')">
		<ProListItem :title="$t('pages.preference.general.labels.launchOnStartup')">
			<Switch v-model:checked="generalStore.app.autostart" />
		</ProListItem>

		<ProListItem
			:description="$t('pages.preference.general.hints.showTaskbarIcon')"
			:title="$t('pages.preference.general.labels.showTaskbarIcon')"
		>
			<Switch v-model:checked="generalStore.app.taskbarVisible" />
		</ProListItem>
	</ProList>

	<ProList :title="$t('pages.preference.general.labels.appearanceSettings')">
		<ThemeMode />

		<ProListItem :title="$t('pages.preference.general.labels.language')">
			<Select v-model="generalStore.appearance.language">
				<SelectTrigger class="w-36" />
				<SelectContent>
					<SelectItem value="zh"> 简体中文 </SelectItem>
					<SelectItem value="en"> English </SelectItem>
				</SelectContent>
			</Select>
		</ProListItem>
	</ProList>

	<ProList :title="$t('pages.preference.general.labels.updateSettings')">
		<ProListItem :title="$t('pages.preference.general.labels.autoCheckUpdate')">
			<Switch v-model:checked="generalStore.update.autoCheck" />
		</ProListItem>
	</ProList>
</template>
