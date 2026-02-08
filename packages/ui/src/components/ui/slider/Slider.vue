<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from "reka-ui";
import { cn } from "@my-monorepo/ui/lib/utils";

const props = withDefaults(
	defineProps<SliderRootProps & { class?: HTMLAttributes["class"] }>(),
	{
		orientation: "horizontal",
	},
);
const emits = defineEmits<SliderRootEmits>();

const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<SliderRoot
		data-slot="slider"
		v-bind="forwarded"
		:class="
			cn(
				'relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[disabled]:opacity-50',
				props.class,
			)
		"
	>
		<SliderTrack
			data-slot="slider-track"
			class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
		>
			<SliderRange
				data-slot="slider-range"
				class="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
			/>
		</SliderTrack>
		<SliderThumb
			v-for="(_, key) in modelValue"
			:key="key"
			data-slot="slider-thumb"
			class="border-primary bg-background block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 hover:ring-primary/20 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-hidden disabled:pointer-events-none"
		/>
	</SliderRoot>
</template>
