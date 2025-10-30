<script lang="ts">
	import Badge from '@/components/ui/badge/badge.svelte';

	const { online }: { online: boolean } = $props();
</script>

<Badge
	class="flex flex-row flex-nowrap items-center gap-1 border text-xs text-[0.7rem] text-nowrap {online
		? 'border-green-700 bg-green-700/50 text-green-300'
		: 'border-red-700 bg-red-700/50 text-red-300'}"
>
	<div class="h-2 w-2 animate-pulse rounded-full {online ? 'bg-green-500' : 'bg-red-500'}"></div>
	<span>{online ? 'online' : 'offline'}</span>
</Badge>
