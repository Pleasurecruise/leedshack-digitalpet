<script setup lang="ts">
import { computed, unref } from "vue";

import { dateFns } from "@my-monorepo/utils";

import { t } from "@/locales";
import { useFocusStore } from "@/stores/focus";
import { useGeneralStore } from "@/stores/general";

const WEEKS = 52;
const WEEK_STARTS_ON = 1;
const LEVEL_CLASSES = [
	"bg-color-6",
	"bg-primary-2",
	"bg-primary-4",
	"bg-primary-6",
	"bg-primary-8",
];

const focusStore = useFocusStore();
const generalStore = useGeneralStore();

const locale = computed(() => {
	return generalStore.appearance.language === "zh" ? "zh-CN" : "en-US";
});

const minutesFromSeconds = (seconds: number) => {
	return seconds > 0 ? Math.max(1, Math.round(seconds / 60)) : 0;
};

const dayLabels = computed(() => {
	const formatter = new Intl.DateTimeFormat(locale.value, { weekday: "short" });
	const base = dateFns.startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON });

	return Array.from({ length: 7 }, (_, index) => {
		const label = formatter.format(dateFns.addDays(base, index));
		return index === 0 || index === 2 || index === 4 ? label : "";
	});
});

const getLevel = (minutes: number) => {
	if (minutes <= 0) return 0;
	if (minutes < 15) return 1;
	if (minutes < 30) return 2;
	if (minutes < 60) return 3;
	return 4;
};

const todayMinutes = computed(() => {
	const key = dateFns.format(dateFns.startOfDay(new Date()), "yyyy-MM-dd");
	return minutesFromSeconds(focusStore.byDay[key] ?? 0);
});

const weekMinutes = computed(() => {
	const start = dateFns.startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON });
	let seconds = 0;

	for (let index = 0; index < 7; index += 1) {
		const date = dateFns.addDays(start, index);
		const key = dateFns.format(date, "yyyy-MM-dd");
		seconds += focusStore.byDay[key] ?? 0;
	}

	return minutesFromSeconds(seconds);
});

const totalMinutes = computed(() => {
	return minutesFromSeconds(unref(focusStore.totalSeconds));
});

const streakDays = computed(() => {
	let streak = 0;
	let cursor = dateFns.startOfDay(new Date());

	for (let index = 0; index < 370; index += 1) {
		const key = dateFns.format(cursor, "yyyy-MM-dd");
		const seconds = focusStore.byDay[key] ?? 0;

		if (seconds <= 0) break;

		streak += 1;
		cursor = dateFns.subDays(cursor, 1);
	}

	return streak;
});

const days = computed(() => {
	const today = dateFns.startOfDay(new Date());
	const start = dateFns.startOfWeek(dateFns.subWeeks(today, WEEKS - 1), {
		weekStartsOn: WEEK_STARTS_ON,
	});
	const totalDays = WEEKS * 7;

	return Array.from({ length: totalDays }, (_, index) => {
		const date = dateFns.addDays(start, index);
		const key = dateFns.format(date, "yyyy-MM-dd");
		const seconds = focusStore.byDay[key] ?? 0;
		const minutes = minutesFromSeconds(seconds);

		return {
			date,
			key,
			minutes,
			level: getLevel(minutes),
		};
	});
});

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat(locale.value, {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
};

const formatTooltip = (date: Date, minutes: number) => {
	const focusText =
		minutes <= 0
			? t("pages.preference.focus.hints.noFocus")
			: `${minutes} ${t("pages.preference.focus.labels.minutes")}`;

	return `${formatDate(date)} · ${focusText}`;
};
</script>

<template>
	<div class="flex flex-col gap-3">
		<div class="grid gap-3 grid-cols-2 md:grid-cols-4">
			<div class="rounded-lg b b-color-2 bg-color-3 p-3">
				<div class="text-xs text-color-3">{{ $t("pages.preference.focus.labels.today") }}</div>
				<div class="text-lg font-semibold">
					{{ todayMinutes }}
					<span class="text-xs text-color-3">{{
						$t("pages.preference.focus.labels.minutes")
					}}</span>
				</div>
			</div>

			<div class="rounded-lg b b-color-2 bg-color-3 p-3">
				<div class="text-xs text-color-3">{{ $t("pages.preference.focus.labels.thisWeek") }}</div>
				<div class="text-lg font-semibold">
					{{ weekMinutes }}
					<span class="text-xs text-color-3">{{
						$t("pages.preference.focus.labels.minutes")
					}}</span>
				</div>
			</div>

			<div class="rounded-lg b b-color-2 bg-color-3 p-3">
				<div class="text-xs text-color-3">{{ $t("pages.preference.focus.labels.streak") }}</div>
				<div class="text-lg font-semibold">
					{{ streakDays }}
					<span class="text-xs text-color-3">{{ $t("pages.preference.focus.labels.days") }}</span>
				</div>
			</div>

			<div class="rounded-lg b b-color-2 bg-color-3 p-3">
				<div class="text-xs text-color-3">{{ $t("pages.preference.focus.labels.total") }}</div>
				<div class="text-lg font-semibold">
					{{ totalMinutes }}
					<span class="text-xs text-color-3">{{
						$t("pages.preference.focus.labels.minutes")
					}}</span>
				</div>
			</div>
		</div>

		<div class="flex gap-2">
			<div class="flex flex-col justify-between py-0.5 text-[10px] text-color-3">
				<span v-for="(label, index) in dayLabels" :key="index" class="h-3 leading-3">
					{{ label }}
				</span>
			</div>

			<div class="overflow-x-auto">
				<div class="grid grid-flow-col grid-rows-7 gap-1 min-w-max">
					<span
						v-for="day in days"
						:key="day.key"
						class="size-3 rounded-sm b b-color-2"
						:class="LEVEL_CLASSES[day.level]"
						:title="formatTooltip(day.date, day.minutes)"
					/>
				</div>
			</div>
		</div>

		<div class="flex items-center gap-2 text-xs text-color-3">
			<span>{{ $t("pages.preference.focus.labels.less") }}</span>
			<div class="flex items-center gap-1">
				<span
					v-for="(levelClass, index) in LEVEL_CLASSES"
					:key="index"
					class="size-3 rounded-sm b b-color-2"
					:class="levelClass"
				/>
			</div>
			<span>{{ $t("pages.preference.focus.labels.more") }}</span>
		</div>
	</div>
</template>
