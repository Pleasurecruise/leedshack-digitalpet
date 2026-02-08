import type { TrayIconOptions } from "@tauri-apps/api/tray";

import { getName, getVersion } from "@tauri-apps/api/app";
import { emit } from "@tauri-apps/api/event";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";
import { resolveResource } from "@tauri-apps/api/path";
import { TrayIcon } from "@tauri-apps/api/tray";
import { openUrl } from "@tauri-apps/plugin-opener";
import { exit, relaunch } from "@tauri-apps/plugin-process";
import { watchDebounced } from "@vueuse/core";
import { watch } from "vue";

import { GITHUB_LINK, LISTEN_KEY } from "@/core/constants";
import { showWindow } from "@/core/window";

import { useSharedMenu } from "./useSharedMenu";

import { t } from "@/core/locales";
import { useCatStore } from "@/stores/cat";
import { useGeneralStore } from "@/stores/general";

const TRAY_ID = "LEEDSHACK_DIGITIALPET_TRAY";

export function useTray() {
	const catStore = useCatStore();
	const generalStore = useGeneralStore();
	const { getSharedMenu } = useSharedMenu();

	watch(
		[
			() => catStore.window.visible,
			() => catStore.window.passThrough,
			() => generalStore.appearance.language,
		],
		() => {
			updateTrayMenu();
		},
	);

	watchDebounced(
		[() => catStore.window.scale, () => catStore.window.opacity],
		() => {
			updateTrayMenu();
		},
		{ debounce: 200 },
	);

	const createTray = async () => {
		const tray = await getTrayById();

		if (tray) return;

		const appName = await getName();
		const appVersion = await getVersion();

		const menu = await getTrayMenu();

		const icon = await resolveResource("assets/tray.png");

		const options: TrayIconOptions = {
			menu,
			icon,
			id: TRAY_ID,
			tooltip: `${appName} v${appVersion}`,
			iconAsTemplate: true,
			menuOnLeftClick: true,
		};

		return TrayIcon.new(options);
	};

	const getTrayById = () => {
		return TrayIcon.getById(TRAY_ID);
	};

	const getTrayMenu = async () => {
		const appVersion = await getVersion();

		const items = await Promise.all([
			...(await getSharedMenu()),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: t("composables.useTray.checkUpdate"),
				action: () => {
					showWindow();

					emit(LISTEN_KEY.UPDATE_APP);
				},
			}),
			MenuItem.new({
				text: t("composables.useTray.openSource"),
				action: () => openUrl(GITHUB_LINK),
			}),
			PredefinedMenuItem.new({ item: "Separator" }),
			MenuItem.new({
				text: `v${appVersion}`,
				enabled: false,
			}),
			MenuItem.new({
				text: t("composables.useTray.restartApp"),
				action: relaunch,
			}),
			MenuItem.new({
				text: t("composables.useTray.quitApp"),
				accelerator: "",
				action: () => exit(0),
			}),
		]);

		return Menu.new({ items });
	};

	const updateTrayMenu = async () => {
		const tray = await getTrayById();

		if (!tray) return;

		const menu = await getTrayMenu();

		tray.setMenu(menu);
	};

	return {
		createTray,
	};
}
