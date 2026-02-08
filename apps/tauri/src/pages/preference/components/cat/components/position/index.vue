<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger } from "@my-monorepo/ui/select";

import ProListItem from "@/components/pro-list-item/index.vue";
import { useCatStore } from "@/stores/cat";

const catStore = useCatStore();
</script>

<template>
	<ProListItem
		:description="$t('pages.preference.cat.hints.position')"
		:title="$t('pages.preference.cat.labels.position')"
	>
		<Select v-model="catStore.window.position">
			<SelectTrigger class="w-36" />
			<SelectContent>
				<SelectItem value="bottomRight">
					{{ $t("pages.preference.cat.options.bottomRight") }}
				</SelectItem>
				<SelectItem value="bottomLeft">
					{{ $t("pages.preference.cat.options.bottomLeft") }}
				</SelectItem>
				<SelectItem value="topLeft">
					{{ $t("pages.preference.cat.options.topLeft") }}
				</SelectItem>
				<SelectItem value="topRight">
					{{ $t("pages.preference.cat.options.topRight") }}
				</SelectItem>
			</SelectContent>
		</Select>
	</ProListItem>
</template>
