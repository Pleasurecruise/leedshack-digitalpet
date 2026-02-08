<script setup lang="ts">
import { storeToRefs } from "pinia";

import { usePetStore } from "@/stores/pet";

const petStore = usePetStore();
const { message, visible, loading } = storeToRefs(petStore);
</script>

<template>
	<Transition
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="opacity-0 translate-y-2 scale-98"
		enter-to-class="opacity-100 translate-y-0 scale-100"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class="opacity-100 translate-y-0 scale-100"
		leave-to-class="opacity-0 translate-y-1 scale-98"
	>
		<div v-if="visible" class="pointer-events-none absolute right-2 top-2 z-20 !h-auto !w-auto">
			<div class="think-bubble w-[min(50vw,200px)] px-4 py-3 text-[12px] text-slate-800">
				<p v-if="message" class="whitespace-pre-line leading-4.5">
					{{ message }}
				</p>
				<p v-else class="whitespace-pre-line leading-4.5">
					{{ loading ? "..." : "" }}
				</p>
				<div class="think-tail think-tail--1" />
				<div class="think-tail think-tail--2" />
				<div class="think-tail think-tail--3" />
			</div>
		</div>
	</Transition>
</template>

<style scoped>
.think-bubble {
	position: relative;
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.86);
	border: 2px solid rgba(255, 255, 255, 0.95);
	box-shadow:
		0 6px 20px rgba(15, 23, 42, 0.14),
		inset 0 0 12px rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10px);
}

.think-tail {
	position: absolute;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.9);
	border: 2px solid rgba(255, 255, 255, 0.95);
	box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
}

.think-tail--1 {
	bottom: -12px;
	left: 20px;
	width: 14px;
	height: 14px;
}

.think-tail--2 {
	bottom: -24px;
	left: 10px;
	width: 9px;
	height: 9px;
}

.think-tail--3 {
	bottom: -33px;
	left: 3px;
	width: 5px;
	height: 5px;
}
</style>
