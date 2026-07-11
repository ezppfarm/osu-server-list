<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import Switch from '@/components/ui/switch/switch.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import { title } from '@/title';
	import type { PageProps } from './$types';
	import type { ServerRequest, ServerRequestInput } from '@osu-server-list/db/types';
	import RequestForm from '../../requests/request-form.svelte';
	import { acceptRequest, denyRequest } from './data.remote';

	const props: PageProps = $props();
	let requests: ServerRequest[] = $state(props.data.requests);

	let reviewOpen = $state(false);
	let loading = $state(false);
	let selectedId = $state<number>(-1);
	let trending = $state(false);
	let denying = $state(false);
	let denialReason = $state('');
	let fields = $state<ServerRequestInput>({
		name: '',
		type: 'BANCHOPY',
		description: '',
		url: '',
		iconUrl: '',
		discordUrl: '',
		tags: '',
		location: ''
	});

	const openReview = (request: ServerRequest) => {
		selectedId = request.id;
		trending = false;
		denying = false;
		denialReason = '';
		fields = {
			name: request.name,
			type: request.type,
			description: request.description ?? '',
			url: request.url,
			iconUrl: request.iconUrl,
			discordUrl: request.discordUrl ?? '',
			tags: request.tags ?? '',
			location: request.location ?? ''
		};
		reviewOpen = true;
	};

	const accept = async () => {
		if (loading) return;
		loading = true;
		const result = await acceptRequest({ id: selectedId, trending, ...fields });
		if (result.success) {
			toast.success(result.message);
			requests = result.requests;
			reviewOpen = false;
		} else toast.error(result.message);
		loading = false;
	};

	const deny = async () => {
		if (loading) return;
		if (!denying) {
			denying = true;
			return;
		}
		loading = true;
		const result = await denyRequest({ id: selectedId, reason: denialReason });
		if (result.success) {
			toast.success(result.message);
			requests = result.requests;
			reviewOpen = false;
		} else toast.error(result.message);
		loading = false;
	};

	onMount(() => {
		title.set('server requests');
	});
</script>

<Dialog.Root bind:open={reviewOpen}>
	<Dialog.Content class="max-w-fit md:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Review Request</Dialog.Title>
			<Dialog.Description>Edit the details before accepting, or deny with a reason.</Dialog.Description>
		</Dialog.Header>
		<RequestForm bind:value={fields} disabled={loading} />
		<div class="flex flex-row items-center gap-1.5">
			<Switch id="req-trending" bind:checked={trending} disabled={loading} />
			<Label for="req-trending">Trending</Label>
		</div>
		{#if denying}
			<div class="grid grid-cols-1 items-center gap-2">
				<Label for="req-reason">Denial reason</Label>
				<Input id="req-reason" bind:value={denialReason} disabled={loading} />
			</div>
		{/if}
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (reviewOpen = false)} disabled={loading}>Cancel</Button>
			<Button variant="destructive" onclick={deny} disabled={loading}>
				{denying ? 'Confirm Deny' : 'Deny'}
			</Button>
			<Button onclick={accept} disabled={loading || denying}>Accept</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<div class="mx-auto mt-12 max-w-4xl px-3 pt-16">
	<Card.Root class="border-card-foreground/15 bg-card/50">
		<Card.Content>
			<div class="flex items-center justify-between py-4">
				<div class="flex items-center gap-2">
					<Button variant="ghost" size="icon" href="/admin"><ChevronLeft /></Button>
					<h1 class="text-xl font-semibold">Pending Requests</h1>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				{#each requests as request (request.id)}
					<div class="flex items-center justify-between gap-2 rounded-md border p-4">
						<div class="flex flex-col">
							<span class="font-medium">{request.name}</span>
							<span class="text-sm text-muted-foreground">{request.url}</span>
						</div>
						<Button onclick={() => openReview(request)}>Review</Button>
					</div>
				{:else}
					<p class="py-6 text-center text-muted-foreground">No pending requests.</p>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
