<script lang="ts">
	import Badge from '@/components/ui/badge/badge.svelte';

	const { serverTags }: { serverTags: string[] } = $props();

	const slicedServerTags = serverTags.slice(0, 2);
</script>

<div class="flex flex-row flex-nowrap items-center gap-0.5">
	{#each slicedServerTags as serverTag}
		<Badge variant="outline">{serverTag}</Badge>
	{/each}
	{#if slicedServerTags.length < serverTags.length}
		<Badge variant="outline">+{serverTags.length - slicedServerTags.length}</Badge>
	{/if}
</div>
