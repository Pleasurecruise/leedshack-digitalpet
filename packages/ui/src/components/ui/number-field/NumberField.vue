<script setup lang="ts">
import type { NumberFieldRootEmits, NumberFieldRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import {
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
	NumberFieldRoot,
	useForwardPropsEmits,
} from "reka-ui";
import { Minus, Plus } from "lucide-vue-next";
import { cn } from "@my-monorepo/ui/lib/utils";

const props = defineProps<
	NumberFieldRootProps & {
		class?: HTMLAttributes["class"];
		suffix?: string;
	}
>();
const emits = defineEmits<NumberFieldRootEmits>();

const delegatedProps = reactiveOmit(props, "class", "suffix");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
	<NumberFieldRoot
		data-slot="number-field"
		v-bind="forwarded"
		:class="cn('flex items-center gap-1', props.class)"
	>
		<NumberFieldDecrement
			data-slot="number-field-decrement"
			class="border-input inline-flex size-8 shrink-0 items-center justify-center rounded-md border bg-transparent text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Minus class="size-3" />
		</NumberFieldDecrement>

		<div class="relative flex items-center">
			<NumberFieldInput
				data-slot="number-field-input"
				class="border-input h-8 w-16 rounded-md border bg-transparent px-2 text-center text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
			/>
			<span
				v-if="suffix"
				class="pointer-events-none absolute right-2 text-xs text-muted-foreground"
			>
				{{ suffix }}
			</span>
		</div>

		<NumberFieldIncrement
			data-slot="number-field-increment"
			class="border-input inline-flex size-8 shrink-0 items-center justify-center rounded-md border bg-transparent text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
		>
			<Plus class="size-3" />
		</NumberFieldIncrement>
	</NumberFieldRoot>
</template>
