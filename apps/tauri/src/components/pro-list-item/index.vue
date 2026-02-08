<script setup lang="ts">
import { computed, useSlots } from "vue";

const { title, description, vertical } = defineProps<{
	title: string;
	description?: string;
	vertical?: boolean;
}>();

const slots = useSlots();

const hasDescription = computed(() => {
	return description || slots.description;
});
</script>

<template>
	<div
		class="b b-color-2 rounded-lg b-solid bg-color-3 p-4 flex justify-between"
		:class="vertical ? 'flex-col gap-4' : 'items-center gap-6'"
	>
		<div class="flex-1 flex items-center">
			<div class="flex flex-col">
				<div class="text-sm font-medium">
					{{ title }}
				</div>

				<div
					class="break-all text-xs [&_a]:(active:text-color-primary-7 hover:text-color-primary-5 text-color-3) text-color-3"
					:class="{ 'mt-2': hasDescription }"
				>
					<slot name="description">
						{{ description }}
					</slot>
				</div>
			</div>
		</div>

		<slot />
	</div>
</template>
