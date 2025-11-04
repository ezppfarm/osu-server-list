<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import utc from 'dayjs/plugin/utc';
	import Navbar from '@/components/ui/navbar/Navbar.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';
	import { Toaster } from '@/components/ui/sonner';
	import { onMount } from 'svelte';
	import { navigationState, user } from '@/global';
	import PageLoader from '@/components/ui/page-loader/PageLoader.svelte';
	import { setupViewTransitions } from '@/viewTransition';
	import { title } from '@/title';

	setupViewTransitions();

	dayjs.extend(relativeTime);
	dayjs.extend(utc);

	let { children, data } = $props();

	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});

	onMount(() => {
		navigationState.set('loaded');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{$title}</title>
</svelte:head>

<Toaster position="top-right" richColors closeButton />

<PageLoader />

<div class="flex min-h-screen flex-col bg-background">
	<Navbar pathName={data.pathName} session={data.session} />

	<main class="flex-1">
		{@render children?.()}
	</main>

	<footer class="mt-auto border-t border-border/40 bg-card/30 py-8">
		<div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
			<p>Built for the osu! community • Not affiliated with osu! or ppy Pty Ltd</p>
		</div>
	</footer>
</div>
