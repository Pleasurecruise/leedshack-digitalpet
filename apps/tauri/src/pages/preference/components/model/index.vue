<script setup lang="ts">
import type { Model } from "@/stores/model";
import type { ComponentPublicInstance } from "vue";

import { convertFileSrc } from "@tauri-apps/api/core";
import { remove } from "@tauri-apps/plugin-fs";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { useElementSize } from "@vueuse/core";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@my-monorepo/ui/alert-dialog";
import { toast } from "@my-monorepo/ui/sonner";
import { ref } from "vue";
import { MasonryGrid, MasonryGridItem } from "vue3-masonry-css";

import FloatMenu from "./components/float-menu/index.vue";
import Upload from "./components/upload/index.vue";

import { t } from "@/locales";
import { useModelStore } from "@/stores/model";
import { join } from "@/utils/path";

const modelStore = useModelStore();
const firstItemRef = ref<HTMLElement>();
const { height } = useElementSize(firstItemRef);

function setFirstItemRef(el: Element | ComponentPublicInstance | null, index: number) {
	if (!el || index > 0) return;

	if ("$el" in el) {
		return (firstItemRef.value = el.$el);
	}

	if (el instanceof HTMLElement) {
		firstItemRef.value = el;
	}
}

async function handleDelete(item: Model) {
	const { id, path } = item;

	try {
		await remove(path, { recursive: true });

		toast.success(t("pages.preference.model.hints.deleteSuccess"));
	} catch (error) {
		toast.error(String(error));
	} finally {
		modelStore.models = modelStore.models.filter((item) => item.id !== id);

		if (id === modelStore.currentModel?.id) {
			modelStore.currentModel = modelStore.models[0];
		}
	}
}
</script>

<template>
	<MasonryGrid :columns="{ 992: 3, 1200: 4, 1600: 6, default: 8 }" :gutter="16">
		<MasonryGridItem>
			<Upload :style="{ height: `${height}px` }" />
		</MasonryGridItem>

		<MasonryGridItem v-for="(item, index) in modelStore.models" :key="item.id">
			<div
				:ref="(el) => setFirstItemRef(el as Element | ComponentPublicInstance | null, index)"
				class="cursor-pointer overflow-hidden rounded-lg border bg-card shadow-sm transition hover:shadow-md"
				@click="modelStore.currentModel = item"
			>
				<img
					alt="cover"
					class="w-full object-cover"
					:src="convertFileSrc(join(item.path, 'resources', 'cover.png'))"
				/>

				<div class="flex items-center justify-around border-t p-2">
					<i
						class="i-iconamoon:check-circle-1-bold cursor-pointer text-4"
						:class="{ 'text-[var(--app-success)]': item.id === modelStore.currentModel?.id }"
					/>

					<i
						class="i-iconamoon:link-external-bold cursor-pointer text-4"
						@click.stop="revealItemInDir(item.path)"
					/>

					<template v-if="!item.isPreset">
						<AlertDialog>
							<AlertDialogTrigger as-child>
								<i class="i-iconamoon:trash-simple-bold cursor-pointer text-4" @click.stop />
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										{{ $t("pages.preference.model.labels.deleteModel") }}
									</AlertDialogTitle>
									<AlertDialogDescription>
										{{ $t("pages.preference.model.hints.deleteModel") }}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										{{ $t("components.updateApp.buttons.updateLater") }}
									</AlertDialogCancel>
									<AlertDialogAction @click="handleDelete(item)">
										{{ $t("pages.preference.model.labels.deleteModel") }}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</template>
				</div>
			</div>
		</MasonryGridItem>
	</MasonryGrid>

	<FloatMenu />
</template>
