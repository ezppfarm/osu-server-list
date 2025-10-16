<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import utc from 'dayjs/plugin/utc';

	dayjs.extend(relativeTime);
	dayjs.extend(utc);

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
