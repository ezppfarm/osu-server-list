<script lang="ts">
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import * as Select from '@/components/ui/select';
	import * as InputGroup from '@/components/ui/input-group';
	import type { ServerRequestInput } from '@osu-server-list/db/types';

	let { value = $bindable(), disabled = false }: { value: ServerRequestInput; disabled?: boolean } =
		$props();

	const serverTypes = [
		{ value: 'BANCHOPY', label: 'BANCHOPY' },
		{ value: 'RIPPLE', label: 'RIPPLE' },
		{ value: 'TITANIC', label: 'TITANIC' },
		{ value: 'SUNRISE', label: 'SUNRISE' }
	];
</script>

<div class="grid gap-4 py-2">
	<div class="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_0.5fr]">
		<div class="grid grid-cols-1 items-center gap-2">
			<Label for="req-name">Name</Label>
			<Input id="req-name" {disabled} bind:value={value.name} />
		</div>
		<div class="grid grid-cols-1 items-center gap-2">
			<Label for="req-type">Type</Label>
			<Select.Root type="single" name="type" bind:value={value.type} {disabled}>
				<Select.Trigger class="w-full">{value.type}</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each serverTypes as serverType (serverType.value)}
							<Select.Item value={serverType.value} label={serverType.label}>
								{serverType.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>
	<div class="grid grid-cols-1 items-center gap-2">
		<Label for="req-description">Description</Label>
		<InputGroup.Root>
			<InputGroup.Textarea
				class="min-h-36"
				id="req-description"
				{disabled}
				bind:value={value.description}
				maxlength={2000}
			/>
			<InputGroup.Addon align="block-end">
				<InputGroup.Text
					class="ml-auto {value.description.length >= 2000
						? 'text-red-500/50'
						: value.description.length >= 1800
							? 'text-orange-500/50'
							: ''}">{value.description.length}/2000</InputGroup.Text
				>
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>
	<div class="grid grid-cols-1 items-center gap-2">
		<Label for="req-url">URL</Label>
		<Input id="req-url" {disabled} bind:value={value.url} />
	</div>
	<div class="grid grid-cols-1 items-center gap-2">
		<Label for="req-discord">Discord URL</Label>
		<Input id="req-discord" {disabled} bind:value={value.discordUrl} />
	</div>
	<div class="grid grid-cols-1 items-center gap-2">
		<Label for="req-icon">Icon URL</Label>
		<Input id="req-icon" {disabled} bind:value={value.iconUrl} />
	</div>
	<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
		<div class="grid grid-cols-1 items-center gap-2">
			<Label for="req-tags">Tags</Label>
			<Input id="req-tags" {disabled} bind:value={value.tags} />
		</div>
		<div class="grid grid-cols-1 items-center gap-2">
			<Label for="req-location">Location</Label>
			<Input id="req-location" {disabled} bind:value={value.location} />
		</div>
	</div>
</div>
