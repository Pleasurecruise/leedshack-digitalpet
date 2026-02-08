<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";

import { useGeneralStore } from "@/stores/general";
import { usePetStore } from "@/stores/pet";

const petStore = usePetStore();
const generalStore = useGeneralStore();
const { inputVisible, loading } = storeToRefs(petStore);
const inputValue = ref("");

const placeholder = computed(() =>
	generalStore.appearance.language === "zh" ? "和我聊聊..." : "Chat with me...",
);

const handleSubmit = async () => {
	const text = inputValue.value.trim();

	if (!text || loading.value) return;

	inputValue.value = "";

	await petStore.sendChatMessage(text);
};

watch(inputVisible, (value) => {
	if (!value) {
		inputValue.value = "";
	}
});
</script>

<template>
	<Transition
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="opacity-0 translate-y-2"
		enter-to-class="opacity-100 translate-y-0"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class="opacity-100 translate-y-0"
		leave-to-class="opacity-0 translate-y-1"
	>
		<div
			v-if="inputVisible"
			class="pointer-events-auto absolute bottom-2 left-1/2 z-20 !h-auto !w-auto -translate-x-1/2"
			@mousedown.stop
			@contextmenu.stop
		>
			<input
				v-model="inputValue"
				class="pet-chat-input w-[min(70vw,240px)]"
				:placeholder="placeholder"
				:disabled="loading"
				maxlength="200"
				@keydown.enter.exact.prevent="handleSubmit"
				@keydown.esc.stop="inputValue = ''"
			/>
		</div>
	</Transition>
</template>

<style scoped>
.pet-chat-input {
	padding: 6px 12px;
	border-radius: 999px;
	border: 1px solid rgba(255, 255, 255, 0.95);
	background: rgba(255, 255, 255, 0.92);
	color: #0f172a;
	font-size: 12px;
	line-height: 1.4;
	box-shadow:
		0 6px 18px rgba(15, 23, 42, 0.12),
		inset 0 0 10px rgba(255, 255, 255, 0.8);
	backdrop-filter: blur(10px);
	outline: none;
}

.pet-chat-input:focus {
	border-color: rgba(148, 163, 184, 0.9);
	box-shadow:
		0 8px 22px rgba(15, 23, 42, 0.18),
		0 0 0 2px rgba(59, 130, 246, 0.2);
}

.pet-chat-input:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
</style>
