export default {
	pages: {
		main: {
			hints: {
				redrawing: "Redrawing...",
			},
		},
		preference: {
			title: "Preferences",
			cat: {
				labels: {
					windowSettings: "Window Settings",
					passThrough: "Pass Through",
					alwaysOnTop: "Always on Top",
					windowSize: "Window Size",
					opacity: "Opacity",
				},
				hints: {
					passThrough: "When enabled, clicks pass through the window without affecting it.",
					alwaysOnTop: "When enabled, the window stays above all other windows.",
					windowSize: "Move mouse to window edge, or hold Shift and right-drag to resize.",
				},
			},
			general: {
				title: "General",
				labels: {
					appSettings: "Application Settings",
					launchOnStartup: "Launch on Startup",
					showTaskbarIcon: "Show Taskbar Icon",
					appearanceSettings: "Appearance Settings",
					themeMode: "Theme Mode",
					language: "Language",
					updateSettings: "Update Settings",
					autoCheckUpdate: "Auto Check for Updates",
					permissionsSettings: "Permissions Settings",
					inputMonitoringPermission: "Input Monitoring Permission",
				},
				options: {
					auto: "System",
					lightMode: "Light",
					darkMode: "Dark",
				},
				hints: {
					showTaskbarIcon: "When enabled, the window can be captured via OBS Studio.",
					inputMonitoringPermission:
						"Enable input monitoring to receive keyboard and mouse events from the system.",
					inputMonitoringPermissionGuide:
						'If the permission is already enabled, select it and click the "-" button to remove it, then manually add it again and restart the app.',
				},
				status: {
					authorized: "Authorized",
					authorize: "Go to Enable",
				},
				buttons: {
					openNow: "Open Now",
					openLater: "Open Later",
				},
			},
		},
	},
	components: {
		updateApp: {
			title: "New Version Found 🥳",
			labels: {
				updateVersion: "Update Version: ",
				updateTime: "Update Time: ",
				changelog: "Changelog: ",
			},
			hints: {
				checkingUpdates: "Checking for updates...",
				alreadyLatest: "Already on the latest version 🎉",
			},
			buttons: {
				updateNow: "Update Now",
				updateLater: "Update Later",
			},
		},
	},
	composables: {
		useSharedMenu: {
			labels: {
				preference: "Preferences...",
				hideCat: "Hide Digital Pet",
				showCat: "Show Digital Pet",
				passThrough: "Pass Through",
				windowSize: "Window Size",
				opacity: "Opacity",
			},
		},
		useTray: {
			checkUpdate: "Check for Updates",
			openSource: "Open Source",
			restartApp: "Restart App",
			quitApp: "Quit App",
		},
	},
	utils: {
		live2d: {
			hints: {
				notFound:
					"Model master configuration file not found, please ensure the model files are complete.",
			},
		},
	},
} as const;
