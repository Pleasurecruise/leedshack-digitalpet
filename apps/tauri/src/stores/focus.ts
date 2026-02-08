import { defineStore } from "pinia";
import { computed, reactive } from "vue";

import { dateFns } from "@my-monorepo/utils";

const MAX_DAYS = 370;
const DAY_FORMAT = "yyyy-MM-dd";
const FLUSH_THRESHOLD_SECONDS = 60;

const getDayKey = (timestamp: number) => {
	return dateFns.format(new Date(timestamp), DAY_FORMAT);
};

export const useFocusStore = defineStore("focus", () => {
	const byDay = reactive<Record<string, number>>({});
	let lastTickAt: number | null = null;
	let bufferedSeconds = 0;
	let bufferStartAt: number | null = null;
	let bufferEndAt: number | null = null;

	const pruneOldDays = (now = new Date()) => {
		const cutoff = dateFns.subDays(dateFns.startOfDay(now), MAX_DAYS);

		for (const key of Object.keys(byDay)) {
			const date = dateFns.parseISO(key);

			if (dateFns.isBefore(date, cutoff)) {
				delete byDay[key];
			}
		}
	};

	const addFocusSeconds = (timestamp: number, seconds: number) => {
		if (!Number.isFinite(seconds) || seconds <= 0) return;

		const key = getDayKey(timestamp);

		byDay[key] = Math.max(0, (byDay[key] ?? 0) + seconds);

		pruneOldDays(new Date(timestamp));
	};

	const resetBuffer = () => {
		bufferedSeconds = 0;
		bufferStartAt = null;
		bufferEndAt = null;
	};

	const addFocusWindow = (startAt: number, endAt: number) => {
		let cursor = startAt;

		while (cursor < endAt) {
			const dayStart = dateFns.startOfDay(new Date(cursor));
			const nextDay = dateFns.addDays(dayStart, 1);
			const segmentEnd = Math.min(endAt, nextDay.getTime());
			const segmentSeconds = (segmentEnd - cursor) / 1000;

			addFocusSeconds(cursor, segmentSeconds);

			cursor = segmentEnd;
		}
	};

	const flush = () => {
		if (bufferStartAt === null || bufferEndAt === null || bufferedSeconds <= 0) {
			resetBuffer();
			return;
		}

		addFocusWindow(bufferStartAt, bufferEndAt);
		resetBuffer();
	};

	const resetTick = (timestamp: number | null = Date.now()) => {
		lastTickAt = timestamp;
		resetBuffer();
	};

	const trackFocus = (now: number, focused: boolean) => {
		if (lastTickAt === null) {
			lastTickAt = now;
			return;
		}

		const deltaSeconds = Math.max(0, (now - lastTickAt) / 1000);
		const deltaStart = lastTickAt;
		lastTickAt = now;

		if (!focused) {
			if (bufferedSeconds > 0) {
				flush();
			}
			return;
		}

		if (deltaSeconds <= 0) return;

		if (bufferStartAt === null) {
			bufferStartAt = deltaStart;
		}

		bufferEndAt = now;
		bufferedSeconds += deltaSeconds;

		if (bufferedSeconds >= FLUSH_THRESHOLD_SECONDS) {
			flush();
		}
	};

	const totalSeconds = computed(() => {
		return Object.values(byDay).reduce((sum, seconds) => sum + seconds, 0);
	});

	return {
		byDay,
		totalSeconds,
		addFocusSeconds,
		trackFocus,
		resetTick,
		flush,
	};
});
