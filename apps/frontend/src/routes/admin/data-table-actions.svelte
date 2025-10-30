<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Pen from '@lucide/svelte/icons/pen';
	import Trash from '@lucide/svelte/icons/trash';

	const { onclick_edit, onclick_delete }: { onclick_edit: () => void; onclick_delete: () => void } =
		$props();
</script>

<div class="flex flex-row flex-nowrap items-center gap-1">
	<Button onclick={onclick_edit} size="icon-sm"><Pen /></Button>
	<Button onclick={onclick_delete} size="icon-sm" variant="destructive"><Trash /></Button>
</div>
