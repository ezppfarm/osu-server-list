<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import Globe from '@lucide/svelte/icons/globe';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Vote from '@lucide/svelte/icons/vote';
	import Home from '@lucide/svelte/icons/home';
	import Heatmap from '@/components/ui/heatmap/Heatmap.svelte';
	import { onMount } from 'svelte';
	import { submitVote } from './data.remote';
	import { toast } from 'svelte-sonner';
	import CustomLoadingIcon from '@/components/ui/sonner/CustomLoadingIcon.svelte';
	import * as Dialog from '@/components/ui/dialog';
	import Input from '@/components/ui/input/input.svelte';
	import { env } from '$env/dynamic/public';
	import { Turnstile } from 'svelte-turnstile';
	import getBrowserFingerprint from 'get-browser-fingerprint';
	import { PowerGlitch } from 'powerglitch';
	import { title } from '@/title';

	const turnstileSiteKey = env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
	const turnstileEnabled = turnstileSiteKey.length > 0;

	const props: PageProps = $props();
	let heatmapData = $state<{ [key: string]: { [key: string]: number } }>({});

	const server = props.data.server;

	let voteDialogOpen = $state(false);

	let glitchElement: HTMLElement | undefined = $state();

	onMount(async () => {
		if (!server) {
			title.set('server not found');
		} else {
			title.set(server.name);
		}
		if (glitchElement) {
			PowerGlitch.glitch(glitchElement, {
				timing: {
					duration: 2250
				},
				glitchTimeSpan: {
					start: 0.2,
					end: 0.8
				},
				shake: {
					velocity: 14,
					amplitudeX: 0.08,
					amplitudeY: 0.08
				},
				slice: {
					count: 3
				}
			});
		}

		browserFingerprint = await getBrowserFingerprint();
		if (props.data.openVoteDialog) voteDialogOpen = true;
		if (props.data.voteUser && props.data.voteUser.trim().length > 0)
			username = props.data.voteUser;
		if (server?.heatmap) {
			heatmapData = server.heatmap.reduce(
				(acc: { [key: string]: { [key: string]: number } }, curr) => {
					if (server.registeredPlayers > -1)
						acc[curr.day] = {
							onlinePlayers: curr.onlinePlayers,
							registeredPlayers: curr.registeredPlayers,
							ping: curr.avgPing,
							votes: curr.votes
						};
					else
						acc[curr.day] = {
							onlinePlayers: curr.onlinePlayers,
							ping: curr.avgPing,
							votes: curr.votes
						};
					return acc;
				},
				{}
			);
		}
	});

	let username = $state('');
	let browserFingerprint = $state(-1);
	let captchaToken = $state('');
	let resetCaptcha: () => undefined = $state(() => {});
	const handleCaptcha = (event: CustomEvent<{ token: string }>) =>
		(captchaToken = event.detail.token);

	const performVote = async () => {
		const currentServer = server;
		if (username.trim().length <= 0) {
			toast.error('Please enter a valid username!');
			return;
		}
		if (!currentServer) {
			toast.error('Server not found!');
			return;
		}
		const toastMessage = toast.loading('Submitting vote...', {
			dismissable: false,
			duration: undefined,
			icon: CustomLoadingIcon
		});
		try {
			const voteResult = await submitVote({
				userName: username,
				serverId: currentServer.id,
				userIp: props.data.userIP ?? 'unknown',
				captchaToken,
				browserFingerprint
			});
			if (voteResult.success) toast.success(voteResult.message);
			else toast.error(voteResult.message);
		} catch {
			toast.error('Failed to submit vote!');
		} finally {
			toast.dismiss(toastMessage);
			voteDialogOpen = false;
		}
	};
</script>

{#if server}
	<Dialog.Root bind:open={voteDialogOpen}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Vote for {server.name}</Dialog.Title>
				<Dialog.Description>
					Please enter your {server.name} name to vote for this server.
				</Dialog.Description>
			</Dialog.Header>
			<Input bind:value={username} />
			{#if turnstileEnabled}
				<Turnstile
					class="mx-auto"
					theme="dark"
					siteKey={turnstileSiteKey}
					on:turnstile-callback={handleCaptcha}
					on:turnstile-error={() => {
						toast.error('Failed to load captcha, please refresh the page.');
					}}
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
				<Button variant="outline" onclick={() => (voteDialogOpen = false)}>Cancel</Button>
				<Button onclick={performVote}>Vote</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
	<section class="relative overflow-hidden border-b border-border/40 py-24">
		<div class="absolute inset-0 bg-gradient-to-b from-accent/25 to-transparent"></div>
		<div class="relative container mx-auto px-4 py-12">
			<div class="mb-12">
				<Card.Root class="z-10 overflow-hidden border-card-foreground/15 bg-card/50">
					<Card.Content class="p-8">
						<div class="z-10 flex flex-col gap-8 md:flex-row">
							<div class="flex-shrink-0">
								<div
									class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border bg-primary/10 p-1"
								>
									<img
										src="/server/{server.id}/logo"
										alt={server.name}
										class="h-full w-full object-contain"
									/>
								</div>
							</div>

							<div class="flex-1 space-y-4">
								<div class="flex flex-wrap items-start justify-between gap-4">
									<div>
										<div class="mb-2 flex items-center gap-3">
											<h1 class="text-4xl font-bold text-foreground">{server.name}</h1>
										</div>
										<div class="mb-3 flex items-center gap-2">
											<div
												class="h-2 w-2 animate-pulse rounded-full {server.onlinePlayers < 0
													? 'bg-red-500'
													: 'bg-green-500'}"
											></div>
											<span class="text-sm text-muted-foreground">
												{#if server.onlinePlayers >= 0}
													Online · {server.onlinePlayers} players
												{:else}
													Offline
												{/if}
											</span>
										</div>
									</div>
									<div class="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											class="bg-transparent text-foreground"
											href={server.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Globe class="mr-2 h-4 w-4" />
											Website
											<ExternalLink class="size-2.5 -translate-x-0.5 -translate-y-[3px]" />
										</Button>
										{#if server.discordUrl}
											<Button
												variant="outline"
												size="sm"
												class="bg-[#5865F2] text-white hover:bg-[#4752C4] hover:text-white"
												href={server.discordUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<svg
													class="mr-2 h-4 w-4 fill-current"
													viewBox="0 0 24 24"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"
													/>
												</svg>
												Discord
											</Button>
										{/if}
										<Button variant="default" size="sm" onclick={() => (voteDialogOpen = true)}>
											<Vote class="mr-2 h-4 w-4" />
											Vote
										</Button>
									</div>
								</div>

								<p class="leading-relaxed text-muted-foreground">{server.description}</p>

								<div class="flex flex-wrap gap-2">
									{#each server.tags as tag}
										<span
											class="inline-block rounded-full border bg-gray-800 px-2 py-0.5 text-xs font-medium"
											>{tag}</span
										>
									{/each}
								</div>

								<div
									class="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 {server.registeredPlayers > -1
										? 'lg:grid-cols-4'
										: 'lg:grid-cols-3'}"
								>
									{#if server.registeredPlayers > -1}
										<div class="rounded-lg border border-border bg-secondary/50 p-3">
											<p class="mb-1 text-xs text-muted-foreground">Total Players</p>
											<p class="text-xl font-bold text-foreground">
												{server.registeredPlayers.toLocaleString('en-US')}
											</p>
										</div>
									{/if}
									<div class="rounded-lg border border-border bg-secondary/50 p-3">
										<p class="mb-1 text-xs text-muted-foreground">Ping</p>
										<p class="text-xl font-bold text-green-500">
											{server.ping.toLocaleString('en-US')}ms
										</p>
									</div>
									<div class="rounded-lg border border-border bg-secondary/50 p-3">
										<p class="mb-1 text-xs text-muted-foreground">Uptime</p>
										<p class="text-xl font-bold text-foreground">
											{isNaN(server.uptime) ? 0 : server.uptime}%
										</p>
									</div>
									<div class="rounded-lg border border-border bg-secondary/50 p-3">
										<p class="mb-1 text-xs text-muted-foreground">Location</p>
										<p class="text-xl font-bold text-foreground">{server.location}</p>
									</div>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
			<Card.Root class="overflow-hidden border-card-foreground/15 bg-card/50">
				<Card.Header>
					<div class="mb-2 px-6 pt-6">
						<h2 class="text-2xl font-bold text-foreground">Server Status Heatmap</h2>
						<p class="text-sm text-muted-foreground">Server uptime over the year</p>
					</div>
				</Card.Header>
				<Card.Content class="overflow-x-auto px-6 pb-6">
					<div class="lg:text-normal mx-auto w-max text-xs">
						<Heatmap
							data={heatmapData}
							dataName="onlinePlayers"
							cellSize={14}
							year={new Date().getFullYear()}
						/>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</section>
{:else}
	<div
		class="relative flex h-[calc(100vh-9.35rem)] items-center justify-center overflow-hidden border-b border-border/40 bg-background p-4"
	>
		<div class="absolute inset-0 bg-gradient-to-b from-accent/25 to-transparent"></div>
		<div class="w-full max-w-2xl space-y-8 text-center">
			<div class="relative">
				<div
					class="text-[12rem] leading-none font-bold text-primary/20 select-none"
					bind:this={glitchElement}
				>
					404
				</div>
			</div>

			<div class="space-y-1">
				<h1 class="text-4xl font-bold text-foreground">Miss! Server Not Found</h1>
				<p class="text-normal mx-auto max-w-md text-muted-foreground">
					Looks like you missed the beat! The server you're looking for doesn't exist or has been
					removed from the list.
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
{/if}
