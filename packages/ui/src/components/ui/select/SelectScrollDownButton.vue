<script setup lang="ts">
import type { SelectScrollDownButtonProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { SelectScrollDownButton } from "reka-ui";
import { cn } from "@my-monorepo/ui/lib/utils";

const props = defineProps<SelectScrollDownButtonProps & { class?: HTMLAttributes["class"] }>();
</script>

<template>
	<SelectScrollDownButton
		data-slot="select-scroll-down-button"
		v-bind="props"
		:class="cn('flex cursor-default items-center justify-center py-1', props.class)"
	>
		<slot>
			<ChevronDown class="size-4" />
		</slot>
	</SelectScrollDownButton>
</template>
