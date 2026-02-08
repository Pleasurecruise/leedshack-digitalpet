import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { fetchPetChat, fetchPetMessage, type PetMessageReason } from "@/core/pet";
import { useGeneralStore } from "@/stores/general";
import { useFocusStore } from "@/stores/focus";

const IDLE_THRESHOLD_MS = 45_000;
const NUDGE_COOLDOWN_MS = 120_000;
const TYPING_WINDOW_MS = 60_000;
const MESSAGE_DURATION_MS = 12_000;

type MetricsSnapshot = {
	idleSeconds: number;
	typingSpeedKpm: number;
	focusSeconds: number;
};

const formatSeconds = (value: number) => Math.max(0, Math.floor(value));

export const usePetStore = defineStore("pet", () => {
	const generalStore = useGeneralStore();
	const focusStore = useFocusStore();
	const message = ref("");
	const visible = ref(false);
	const inputVisible = ref(false);
	const loading = ref(false);
	const lastKeyAt = ref(Date.now());
	const focusStartedAt = ref(Date.now());
	const idleSince = ref<number | null>(null);
	const lastFocusSeconds = ref(0);
	const lastNudgeAt = ref(0);
	const keyPresses = ref<number[]>([]);

	let idleTimer: ReturnType<typeof setInterval> | null = null;
	let hideTimer: ReturnType<typeof setTimeout> | null = null;

	const pruneKeyPresses = (now: number) => {
		keyPresses.value = keyPresses.value.filter((timestamp) => now - timestamp <= TYPING_WINDOW_MS);
	};

	const typingSpeedKpm = computed(() => {
		const now = Date.now();
		pruneKeyPresses(now);
		return Math.round((keyPresses.value.length * 60_000) / TYPING_WINDOW_MS);
	});

	const getMetricsSnapshot = (now = Date.now()): MetricsSnapshot => {
		pruneKeyPresses(now);
		const idleMs = now - lastKeyAt.value;
		const idleSeconds = formatSeconds(idleMs / 1000);
		const focusSeconds =
			idleMs >= IDLE_THRESHOLD_MS
				? lastFocusSeconds.value
				: formatSeconds((now - focusStartedAt.value) / 1000);

		return {
			idleSeconds,
			typingSpeedKpm: typingSpeedKpm.value,
			focusSeconds,
		};
	};

	const showMessage = (text: string, durationMs = MESSAGE_DURATION_MS) => {
		message.value = text;
		visible.value = true;

		if (hideTimer) {
			clearTimeout(hideTimer);
		}

		hideTimer = setTimeout(() => {
			visible.value = false;
		}, durationMs);
	};

	const setInputVisible = (value: boolean) => {
		inputVisible.value = value;
	};

	const getFallbackMessage = (
		reason: PetMessageReason,
		language: "zh" | "en",
		metrics: MetricsSnapshot,
	) => {
		const focusMinutes = Math.max(1, Math.round(metrics.focusSeconds / 60));
		const speed = Math.max(0, Math.round(metrics.typingSpeedKpm));
		const idleSeconds = Math.max(0, Math.round(metrics.idleSeconds));

		if (language === "en") {
			if (reason === "speed") {
				return `Typing speed is about ${speed} keys/min. Nice rhythm!`;
			}

			if (reason === "focus") {
				return `You've focused for about ${focusMinutes} minutes. Stretch break?`;
			}

			return `Idle for ~${idleSeconds}s. You've focused ${focusMinutes} minutes—need a quick reset?`;
		}

		if (reason === "speed") {
			return `刚刚输入速度大约 ${speed} 字/分钟，节奏很稳哦。`;
		}

		if (reason === "focus") {
			return `已经专注约 ${focusMinutes} 分钟啦，要不要伸个懒腰？`;
		}

		return `你停下来 ${idleSeconds} 秒左右啦，已经专注 ${focusMinutes} 分钟，要不要休息一下？`;
	};

	const getChatFallback = (language: "zh" | "en") => {
		if (language === "en") {
			return "Hmm... can you try asking in a different way?";
		}

		return "唔...可以换个说法再问问吗？";
	};

	const triggerMessage = async (reason: PetMessageReason) => {
		if (loading.value) return;

		loading.value = true;
		const language = generalStore.appearance.language ?? "en";
		const metrics = getMetricsSnapshot();

		try {
			const text = await fetchPetMessage({ reason, language, metrics });
			showMessage(text || getFallbackMessage(reason, language, metrics));
		} catch {
			showMessage(getFallbackMessage(reason, language, metrics));
		} finally {
			loading.value = false;
		}
	};

	const sendChatMessage = async (content: string) => {
		const trimmed = content.trim();

		if (!trimmed || loading.value) return;

		loading.value = true;
		const language = generalStore.appearance.language ?? "en";

		showMessage("", 20_000);

		try {
			const text = await fetchPetChat({ message: trimmed, language });
			showMessage(text || getChatFallback(language));
		} catch {
			showMessage(getChatFallback(language));
		} finally {
			loading.value = false;
		}
	};

	const checkIdle = () => {
		const now = Date.now();
		const idleMs = now - lastKeyAt.value;

		focusStore.trackFocus(now, idleMs < IDLE_THRESHOLD_MS);

		if (idleMs >= IDLE_THRESHOLD_MS) {
			if (!idleSince.value) {
				idleSince.value = lastKeyAt.value;
				lastFocusSeconds.value = formatSeconds((lastKeyAt.value - focusStartedAt.value) / 1000);
			}

			if (now - lastNudgeAt.value >= NUDGE_COOLDOWN_MS) {
				lastNudgeAt.value = now;
				void triggerMessage("idle");
			}
		}
	};

	const recordKeyPress = () => {
		const now = Date.now();

		lastKeyAt.value = now;
		keyPresses.value.push(now);
		pruneKeyPresses(now);

		if (idleSince.value) {
			idleSince.value = null;
			focusStartedAt.value = now;
		}
	};

	const start = () => {
		if (idleTimer) return;

		const now = Date.now();
		lastKeyAt.value = now;
		focusStartedAt.value = now;
		idleSince.value = null;
		focusStore.resetTick(now);

		idleTimer = setInterval(checkIdle, 1000);
	};

	const stop = () => {
		if (idleTimer) {
			clearInterval(idleTimer);
			idleTimer = null;
		}

		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = null;
		}

		focusStore.flush();
		focusStore.resetTick(null);
	};

	return {
		message,
		visible,
		inputVisible,
		loading,
		recordKeyPress,
		sendChatMessage,
		setInputVisible,
		start,
		stop,
	};
});
