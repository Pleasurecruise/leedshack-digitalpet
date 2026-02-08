<script setup lang="ts">
import { openUrl } from "@tauri-apps/plugin-opener";
import { Button } from "@my-monorepo/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@my-monorepo/ui/tooltip";
import { ref } from "vue";

const menuOpen = ref(false);
</script>

<template>
	<div class="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-center gap-2">
		<TooltipProvider>
			<Button
				class="size-12 rounded-full shadow-lg"
				@click="menuOpen = !menuOpen"
			>
				<i class="i-solar:hamburger-menu-bold text-5" />
			</Button>

			<Transition
				enter-active-class="transition-all duration-200 ease-out"
				enter-from-class="opacity-0 scale-90 translate-y-2"
				enter-to-class="opacity-100 scale-100 translate-y-0"
				leave-active-class="transition-all duration-150 ease-in"
				leave-from-class="opacity-100 scale-100 translate-y-0"
				leave-to-class="opacity-0 scale-90 translate-y-2"
			>
				<div v-show="menuOpen" class="flex flex-col-reverse items-center gap-2">
					<Tooltip>
						<TooltipTrigger as-child>
							<Button
								class="size-10 rounded-full shadow-md"
								variant="outline"
								@click="openUrl('https://juejin.cn/post/7509872655802269731')"
							>
								<i class="i-solar:pen-2-bold text-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							{{ $t("pages.preference.model.tooltips.createModel") }}
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger as-child>
							<Button
								class="size-10 rounded-full shadow-md"
								variant="outline"
								@click="openUrl('https://leedshack-digitialpet.vteamer.cc')"
							>
								<i class="i-solar:refresh-bold text-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							{{ $t("pages.preference.model.tooltips.convertModel") }}
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger as-child>
							<Button
								class="size-10 rounded-full shadow-md"
								variant="outline"
								@click="openUrl('https://github.com/ayangweb/Awesome-leedshack-digitialpet')"
							>
								<i class="i-solar:list-bold text-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">
							{{ $t("pages.preference.model.tooltips.moreModels") }}
						</TooltipContent>
					</Tooltip>
				</div>
			</Transition>
		</TooltipProvider>
	</div>
</template>
