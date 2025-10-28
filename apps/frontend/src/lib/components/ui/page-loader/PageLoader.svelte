<script lang="ts">
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { navigationState } from '$lib/global';
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';

	const progress = new Tween(0, {
		duration: 3500,
		easing: cubicOut
	});
	const opacity = new Tween(1, { easing: cubicOut });
	const unsubscribe = navigationState.subscribe((state) => {
		if (state === 'loading') {
			opacity.set(1, { duration: 0 });
			progress.set(0.7, { duration: 3500 });
		} else if (state === 'loaded') {
			const duration = 750;

			progress.set(1, { duration });
			opacity.set(0, { duration: duration / 1.5, delay: duration / 1.5 });

			setTimeout(() => {
				progress.set(0, { duration: 0 });
			}, duration);
		}
	});
	onMount(() => {
		progress.set(0.7);
		return () => unsubscribe();
	});
	beforeNavigate(async (nav) => {
		if (nav.type === 'link' && !nav.willUnload) {
			navigationState.set('loading');
		}
	});

	afterNavigate(() => {
		navigationState.set('loaded');
	});
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div class="progress-bar" style={`opacity: ${opacity.current}`}>
	<div class="progress-sliver bg-primary" style={`--width: ${progress.current * 100}%`}></div>
</div>

<style lang="postcss">
	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 0.1rem;
		z-index: 9999;
	}
	.progress-sliver {
		width: var(--width);
		height: 100%;
	}
</style>
