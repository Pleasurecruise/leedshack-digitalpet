import {
	defineConfig,
	presetIcons,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";
import presetAnimations from "unocss-preset-animations";
import { presetShadcn } from "unocss-preset-shadcn";

export default defineConfig({
	presets: [
		presetWind3(),
		presetIcons(),
		presetAnimations(),
		presetShadcn(
			{
				color: "neutral",
			},
			{
				componentLibrary: "reka",
			},
		),
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives({
			applyVariable: ["--uno"],
		}),
	],
	content: {
		pipeline: {
			include: [
				/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
				"(components|src)/**/*.{js,ts}",
				"../../packages/ui/src/**/*.{vue,ts}",
			],
		},
	},
	shortcuts: [
		[/^bg-color-(\d+)$/, ([, d]) => `bg-bg-${d}`],
		[/^text-color-(\d+)$/, ([, d]) => `text-text-${d}`],
		[/^b-color-(\d+)$/, ([, d]) => `b-border-${d}`],
		[/^(.*)-primary-(\d+)$/, ([, s, d]) => `${s}-[var(--app-blue-${d})]`],
	],
	theme: {
		colors: {
			"bg-1": "var(--app-bg-1)",
			"bg-2": "var(--app-bg-2)",
			"bg-3": "var(--app-bg-3)",
			"bg-4": "var(--app-bg-4)",
			"bg-5": "var(--app-bg-5)",
			"bg-6": "var(--app-bg-6)",
			"bg-7": "var(--app-bg-7)",
			"bg-8": "var(--app-bg-8)",
			"text-1": "var(--app-text-1)",
			"text-2": "var(--app-text-2)",
			"text-3": "var(--app-text-3)",
			"text-4": "var(--app-text-4)",
			"border-1": "var(--app-border-1)",
			"border-2": "var(--app-border-2)",
			"ant-primary": "var(--app-primary)",
			"ant-success": "var(--app-success)",
			"ant-danger": "var(--app-danger)",
		},
	},
});
