<script setup lang="ts">
import { Toaster as Sonner } from "vue-sonner";

const props = withDefaults(
	defineProps<{
		position?:
			| "top-left"
			| "top-right"
			| "bottom-left"
			| "bottom-right"
			| "top-center"
			| "bottom-center";
		expand?: boolean;
		richColors?: boolean;
		closeButton?: boolean;
		duration?: number;
	}>(),
	{
		position: "bottom-right",
		expand: false,
		richColors: true,
		closeButton: false,
		duration: 3000,
	},
);
</script>

<template>
	<Sonner
		data-slot="sonner"
		class="toaster group"
		:position="position"
		:expand="expand"
		:rich-colors="richColors"
		:close-button="closeButton"
		:duration="duration"
		:toast-options="{
			classes: {
				toast:
					'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
				description: 'group-[.toast]:text-muted-foreground',
				actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
				cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
			},
		}"
	/>
</template>
