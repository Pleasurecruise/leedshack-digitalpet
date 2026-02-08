<script setup lang="ts">
import type { SelectScrollUpButtonProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { ChevronUp } from "lucide-vue-next";
import { SelectScrollUpButton } from "reka-ui";
import { cn } from "@my-monorepo/ui/lib/utils";

const props = defineProps<SelectScrollUpButtonProps & { class?: HTMLAttributes["class"] }>();
</script>

<template>
	<SelectScrollUpButton
		data-slot="select-scroll-up-button"
		v-bind="props"
		:class="cn('flex cursor-default items-center justify-center py-1', props.class)"
	>
		<slot>
			<ChevronUp class="size-4" />
		</slot>
	</SelectScrollUpButton>
</template>
