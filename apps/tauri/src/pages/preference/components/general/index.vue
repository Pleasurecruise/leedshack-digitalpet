<script setup lang="ts">
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { Switch } from "@my-monorepo/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@my-monorepo/ui/select";
import { NumberField } from "@my-monorepo/ui/number-field";
import { Slider } from "@my-monorepo/ui/slider";
import { computed, watch } from "vue";

import ThemeMode from "./components/theme-mode/index.vue";
import FocusHeatmap from "./components/focus-heatmap/index.vue";

import ProList from "@/components/pro-list/index.vue";
import ProListItem from "@/components/pro-list-item/index.vue";
import { useGeneralStore } from "@/stores/general";
import { useCatStore } from "@/stores/cat";

const generalStore = useGeneralStore();
const catStore = useCatStore();

const opacityValue = computed({
	get: () => [catStore.window.opacity],
	set: (val: number[]) => {
		catStore.window.opacity = val[0];
	},
});

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
	<ProList :title="$t('pages.preference.focus.labels.sectionTitle')">
		<ProListItem
			:title="$t('pages.preference.focus.labels.heatmapTitle')"
			:description="$t('pages.preference.focus.hints.heatmapDescription')"
			vertical
		>
			<FocusHeatmap />
		</ProListItem>
	</ProList>

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

	<ProList :title="$t('pages.preference.cat.labels.windowSettings')">
		<ProListItem
			:description="$t('pages.preference.cat.hints.passThrough')"
			:title="$t('pages.preference.cat.labels.passThrough')"
		>
			<Switch v-model:checked="catStore.window.passThrough" />
		</ProListItem>

		<ProListItem
			:description="$t('pages.preference.cat.hints.alwaysOnTop')"
			:title="$t('pages.preference.cat.labels.alwaysOnTop')"
		>
			<Switch v-model:checked="catStore.window.alwaysOnTop" />
		</ProListItem>

		<ProListItem
			:description="$t('pages.preference.cat.hints.windowSize')"
			:title="$t('pages.preference.cat.labels.windowSize')"
		>
			<NumberField v-model="catStore.window.scale" :max="500" :min="1" suffix="%" />
		</ProListItem>

		<ProListItem :title="$t('pages.preference.cat.labels.opacity')" vertical>
			<Slider v-model="opacityValue" :max="100" :min="10" :step="1" />
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
