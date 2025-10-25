<script lang="ts">
	import { page } from '$app/state';
	import Button from '@/components/ui/button/button.svelte';
	import Home from '@lucide/svelte/icons/home';

	const errorTitles: { [key: number]: string } = {
		404: 'Miss! Server Not Found',
		500: 'Failed! Something Went Wrong'
	};
	const errorTexts: { [key: number]: string } = {
		404: "Looks like you missed the beat! The server you're looking for doesn't exist or has been removed from the list.",
		500: "The server encountered an unexpected error. Don't worry, it happens to the best of us. Try refreshing or head back home."
	};
</script>

<div
	class="relative flex h-[calc(100vh-9.35rem)] items-center justify-center overflow-hidden border-b border-border/40 bg-background p-4"
>
	<div class="absolute inset-0 bg-gradient-to-b from-accent/25 to-transparent"></div>
	<div class="w-full max-w-2xl space-y-8 text-center">
		<div class="relative">
			<div class="animate-pulse text-[12rem] leading-none font-bold text-primary/20 select-none">
				{page.status}
			</div>
		</div>

		<div class="space-y-1">
			<h1 class="text-4xl font-bold text-foreground">{errorTitles[page.status] ?? 'Error'}</h1>
			<p class="text-normal mx-auto max-w-md text-muted-foreground">
				{errorTexts[page.status] ?? 'Something went wrong.'}
			</p>
		</div>

		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<Button href="/" size="lg" class="gap-2">
				<Home class="h-4 w-4" />
				Back to Server List
			</Button>
		</div>
	</div>
</div>
