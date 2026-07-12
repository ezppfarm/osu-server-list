<script lang="ts">
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { Turnstile } from 'svelte-turnstile';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Badge } from '@/components/ui/badge';
	import Plus from '@lucide/svelte/icons/plus';
	import { title } from '@/title';
	import type { PageProps } from './$types';
	import type { ServerRequest, ServerRequestInput } from '@osu-server-list/db/types';
	import RequestForm from './request-form.svelte';
	import { submitServerRequest } from './data.remote';

	const props: PageProps = $props();
	let requests: ServerRequest[] = $state(props.data.requests);

	const turnstileSiteKey = env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
	const turnstileEnabled = turnstileSiteKey.length > 0;

	let dialogOpen = $state(false);
	let loading = $state(false);
	let captchaToken = $state('');
	let resetCaptcha: () => undefined = $state(() => {});

	const emptyRequest = (): ServerRequestInput => ({
		name: '',
		type: 'BANCHOPY',
		description: '',
		url: '',
		iconUrl: '',
		discordUrl: '',
		tags: '',
		location: ''
	});
	let requestObject = $state<ServerRequestInput>(emptyRequest());

	const submit = async () => {
		if (loading) return;
		if (turnstileEnabled && captchaToken.length <= 0) {
			toast.error('Please complete the captcha');
			return;
		}
		loading = true;
		const result = await submitServerRequest({ ...requestObject, captchaToken });
		if (result.success) {
			toast.success(result.message);
			requests = result.requests;
			dialogOpen = false;
			requestObject = emptyRequest();
		} else {
			toast.error(result.message);
		}
		resetCaptcha();
		captchaToken = '';
		loading = false;
	};

	onMount(() => {
		title.set('my requests');
	});
</script>

<Dialog.Root
	bind:open={dialogOpen}
	onOpenChangeComplete={(val) => {
		if (!val) requestObject = emptyRequest();
	}}
>
	<Dialog.Content class="max-w-fit md:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Request a Server</Dialog.Title>
			<Dialog.Description>Submit a server for review by the admins.</Dialog.Description>
		</Dialog.Header>
		<RequestForm bind:value={requestObject} disabled={loading} />
		{#if turnstileEnabled}
			<Turnstile
				siteKey={turnstileSiteKey}
				on:turnstile-callback={(e) => (captchaToken = e.detail.token)}
				on:turnstile-error={() => toast.error('Failed to load captcha, please refresh the page.')}
				on:turnstile-expired={() => {
					toast.warning('Captcha expired, please retry.');
					resetCaptcha();
				}}
				on:turnstile-timeout={() => {
					toast.warning('Captcha timed out, please retry.');
					resetCaptcha();
				}}
				bind:reset={resetCaptcha}
			/>
		{/if}
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)}>Cancel</Button>
			<Button onclick={submit} disabled={loading}>Submit Request</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<div class="mx-auto mt-12 max-w-7xl px-3 pt-16">
	<Card.Root class="border-card-foreground/15 bg-card/50">
		<Card.Content>
			<div class="flex items-center justify-between py-4">
				<h1 class="text-xl font-semibold">My Requests</h1>
				<Button onclick={() => (dialogOpen = true)}><Plus />Request a Server</Button>
			</div>
			<div class="flex flex-col gap-3">
				{#each requests as request (request.id)}
					<div class="flex flex-col gap-1 rounded-md border p-4">
						<div class="flex items-center justify-between gap-2">
							<span class="font-medium">{request.name}</span>
							{#if request.status === 'PENDING'}
								<Badge variant="secondary">Pending review</Badge>
							{:else if request.status === 'ACCEPTED'}
								<Badge variant="default">Accepted</Badge>
							{:else}
								<Badge variant="destructive">Denied</Badge>
							{/if}
						</div>
						{#if request.status === 'ACCEPTED'}
							<p class="text-sm text-muted-foreground">
								Your server "{request.name}" got accepted!
							</p>
						{:else if request.status === 'DENIED'}
							<p class="text-sm text-muted-foreground">
								Your server "{request.name}" got denied for: {request.denialReason}
							</p>
						{/if}
					</div>
				{:else}
					<p class="py-6 text-center text-muted-foreground">
						You haven't requested any servers yet.
					</p>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>
</div>
