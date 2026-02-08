<script setup lang="ts">
const { title } = defineProps<{
	title: string;
}>();
</script>

<template>
	<div class="not-last:mb-4 flex flex-col gap-2">
		<div class="text-4 font-medium" data-tauri-drag-region>
			{{ title }}
		</div>

		<div class="flex flex-col gap-4">
			<slot />
		</div>
	</div>
</template>
