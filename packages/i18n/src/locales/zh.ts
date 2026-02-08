export default {
	pages: {
		main: {
			hints: {
				redrawing: "重绘中...",
			},
		},
		preference: {
			title: "偏好设置",
			cat: {
				labels: {
					windowSettings: "窗口设置",
					passThrough: "窗口穿透",
					alwaysOnTop: "窗口置顶",
					windowSize: "窗口尺寸",
					opacity: "不透明度",
				},
				hints: {
					passThrough: "启用后，窗口不影响对其他应用程序的操作。",
					alwaysOnTop: "启用后，窗口始终显示在其他应用程序上方。",
					windowSize: "将鼠标移至窗口边缘，或按住 Shift 并右键拖动，也可以调整窗口大小。",
				},
			},
			general: {
				title: "通用设置",
				labels: {
					appSettings: "应用设置",
					launchOnStartup: "开机自启动",
					showTaskbarIcon: "显示任务栏图标",
					appearanceSettings: "外观设置",
					themeMode: "主题模式",
					language: "语言",
					updateSettings: "更新设置",
					autoCheckUpdate: "自动检查更新",
					permissionsSettings: "权限设置",
					inputMonitoringPermission: "输入监控权限",
				},
				options: {
					auto: "跟随系统",
					lightMode: "亮色模式",
					darkMode: "暗色模式",
				},
				hints: {
					showTaskbarIcon: "启用后，即可通过 OBS Studio 捕获窗口。",
					inputMonitoringPermission:
						"开启输入监控权限，以便接收系统的键盘和鼠标事件来响应你的操作。",
					inputMonitoringPermissionGuide:
						'如果权限已开启，请先选中并点击"-"按钮将其删除，然后重新手动添加，最后重启应用以确保权限生效。',
				},
				status: {
					authorized: "已授权",
					authorize: "去授权",
				},
				buttons: {
					openNow: "前往开启",
					openLater: "稍后开启",
				},
			},
			focus: {
				labels: {
					sectionTitle: "专注洞察",
					heatmapTitle: "每日专注热力图",
					today: "今日",
					thisWeek: "本周",
					streak: "连续",
					total: "累计",
					minutes: "分钟",
					days: "天",
					less: "少",
					more: "多",
				},
				hints: {
					heatmapDescription: "根据键盘活动统计每日专注分钟数。",
					noFocus: "暂无专注",
				},
			},
		},
	},
	components: {
		updateApp: {
			title: "发现新版本🥳",
			labels: {
				updateVersion: "更新版本：",
				updateTime: "更新时间：",
				changelog: "更新日志：",
			},
			hints: {
				checkingUpdates: "正在检查更新...",
				alreadyLatest: "当前已是最新版本🎉",
			},
			buttons: {
				updateNow: "立即更新",
				updateLater: "稍后更新",
			},
		},
	},
	composables: {
		useSharedMenu: {
			labels: {
				preference: "偏好设置...",
				hideCat: "隐藏桌宠",
				showCat: "显示桌宠",
				passThrough: "窗口穿透",
				windowSize: "窗口尺寸",
				opacity: "不透明度",
			},
		},
		useTray: {
			checkUpdate: "检查更新",
			openSource: "开源地址",
			restartApp: "重启应用",
			quitApp: "退出应用",
		},
	},
	utils: {
		live2d: {
			hints: {
				notFound: "未找到模型主配置文件，请确认模型文件是否完整。",
			},
		},
	},
} as const;
