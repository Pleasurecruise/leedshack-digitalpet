<script setup lang="ts">
import { Switch } from "@my-monorepo/ui/switch";
import { NumberField } from "@my-monorepo/ui/number-field";
import { Slider } from "@my-monorepo/ui/slider";
import { computed } from "vue";

import Position from "./components/position/index.vue";

import ProList from "@/components/pro-list/index.vue";
import ProListItem from "@/components/pro-list-item/index.vue";
import { useCatStore } from "@/stores/cat";
import { isWindows } from "@/utils/platform";

const catStore = useCatStore();

const opacityValue = computed({
	get: () => [catStore.window.opacity],
	set: (val: number[]) => {
		catStore.window.opacity = val[0];
	},
});
</script>

<template>
	<ProList :title="$t('pages.preference.cat.labels.modelSettings')">
		<ProListItem
			:description="$t('pages.preference.cat.hints.mirrorMode')"
			:title="$t('pages.preference.cat.labels.mirrorMode')"
		>
			<Switch v-model:checked="catStore.model.mirror" />
		</ProListItem>

		<ProListItem
			:description="$t('pages.preference.cat.hints.singleMode')"
			:title="$t('pages.preference.cat.labels.singleMode')"
		>
			<Switch v-model:checked="catStore.model.single" />
		</ProListItem>

		<ProListItem
			:description="$t('pages.preference.cat.hints.mouseMirror')"
			:title="$t('pages.preference.cat.labels.mouseMirror')"
		>
			<Switch v-model:checked="catStore.model.mouseMirror" />
		</ProListItem>

		<ProListItem
			v-if="isWindows"
			:description="$t('pages.preference.cat.hints.autoReleaseDelay')"
			:title="$t('pages.preference.cat.labels.autoReleaseDelay')"
		>
			<NumberField v-model="catStore.model.autoReleaseDelay" suffix="s" />
		</ProListItem>
	</ProList>

	<ProList :title="$t('pages.preference.cat.labels.windowSettings')">
		<Position />

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
			:description="$t('pages.preference.cat.hints.hideOnHover')"
			:title="$t('pages.preference.cat.labels.hideOnHover')"
		>
			<Switch v-model:checked="catStore.window.hideOnHover" />
		</ProListItem>

		<ProListItem
			:description="$t('pages.preference.cat.hints.windowSize')"
			:title="$t('pages.preference.cat.labels.windowSize')"
		>
			<NumberField v-model="catStore.window.scale" :max="500" :min="1" suffix="%" />
		</ProListItem>

		<ProListItem :title="$t('pages.preference.cat.labels.windowRadius')">
			<NumberField v-model="catStore.window.radius" :min="0" suffix="%" />
		</ProListItem>

		<ProListItem :title="$t('pages.preference.cat.labels.opacity')" vertical>
			<Slider v-model="opacityValue" :max="100" :min="10" :step="1" />
		</ProListItem>
	</ProList>
</template>
