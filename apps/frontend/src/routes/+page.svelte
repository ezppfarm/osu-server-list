<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import type { PageProps } from './$types';
	import { browser } from '$app/environment';
	import { getSortName, sortServers } from '@/helpers';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Server from '@lucide/svelte/icons/server';
	import Users from '@lucide/svelte/icons/users';
	import Vote from '@lucide/svelte/icons/vote';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';
	import Funnel from '@lucide/svelte/icons/funnel';
	import Globe from '@lucide/svelte/icons/globe';
	import List from '@lucide/svelte/icons/list';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import { onMount } from 'svelte';
	import type { ServerFull } from '@osu-server-list/db/types';
	import TrendingWrapper from '@/components/ui/effects/TrendingWrapper.svelte';
	import { title } from '@/title';
	import * as Select from '@/components/ui/select';

	const props: PageProps = $props();

	let servers = $state<ServerFull[]>([]);
	let sort = $state('votes');

	type CategoryFilter = {
		label: string;
		value: string;
	};

	let categoryFilters = $state<string[]>([]);
	let availableCategoryFilters = $state<CategoryFilter[]>([]);

	function updateSort(value: string) {
		if (!servers) return;
		if (browser) {
			localStorage.setItem('sort', value);
		}
		servers = sortServers(servers, value);
		sort = value;
	}

	onMount(() => {
		sort = localStorage.getItem('sort') ?? 'votes';
		servers = sortServers(props.data.servers ?? [], sort);

		if (servers) {
			const allTags = servers.flatMap((server) => server.tags?.split(',') || []);
			for (const tag of allTags) {
				if (!availableCategoryFilters.find((f) => f.value === tag.toLowerCase())) {
					availableCategoryFilters.push({ label: tag, value: tag.toLowerCase() });
				}
			}
		}

		title.set('browse servers');
	});
</script>

<section class="relative overflow-hidden border-b border-border/40 py-24 pt-40">
	<div class="absolute inset-0 bg-gradient-to-b from-accent/25 to-transparent"></div>
	<div class="relative container mx-auto px-4 text-center">
		<div
			class="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
		>
			<TrendingUp class="h-3.5 w-3.5" />
			<span>Discover the best osu! private servers</span>
		</div>
		<h1 class="mb-4 text-5xl font-bold tracking-tight text-balance lg:text-6xl">
			Your Gateway to
			<span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
				osu! Communities
			</span>
		</h1>
		<p class="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
			Browse, compare, and join thriving osu! private servers. Find communities with custom
			features, unique gameplay modes, and active player bases.
		</p>
		<div class="flex items-center justify-center">
			<Button
				onclick={() => {
					window.scrollTo({
						behavior: 'smooth',
						top: Math.max((document.getElementById('server-view')?.offsetTop ?? 0) - 30, 0)
					});
				}}
			>
				<ArrowDown class="animate-bounce" />
				Browse osu! Servers
			</Button>
		</div>
	</div>
</section>

<div class="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 px-3 md:grid-cols-3 lg:px-0">
	<Card.Root class="border-card-foreground/15 bg-card/50">
		<Card.Content class="p-6">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg border bg-primary/10">
					<Server class="h-6 w-6 text-primary" />
				</div>
				<div>
					<p class="text-2xl font-bold text-foreground">
						{Math.max(servers.filter((s) => s.onlinePlayers >= 0).length, 0)}
					</p>
					<p class="text-sm text-muted-foreground">Online Servers</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="border-card-foreground/15 bg-card/50">
		<Card.Content class="p-6">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg border bg-primary/10">
					<Users class="h-6 w-6 text-primary" />
				</div>
				<div>
					<p class="text-2xl font-bold text-foreground">
						{Math.max(
							servers.reduce((a, b) => a + Math.max(b.onlinePlayers, 0), 0),
							0
						)}
					</p>
					<p class="text-sm text-muted-foreground">Total Online Players</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="border-card-foreground/15 bg-card/50">
		<Card.Content class="p-6">
			<div class="flex items-center gap-4">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg border bg-primary/10">
					<Vote class="h-6 w-6 text-primary" />
				</div>
				<div>
					<p class="text-2xl font-bold text-foreground">
						{Math.max(
							servers.reduce((a, b) => a + Math.max(b.votes, 0), 0),
							0
						)}
					</p>
					<p class="text-sm text-muted-foreground">Total Votes</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>

<main class="container mx-auto px-4 py-12" id="server-view">
	<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
		<div>
			<h2 class="text-2xl font-semibold tracking-tight">
				<Server class="mr-2 inline-block h-6 w-6 text-primary" />
				Top Servers
			</h2>
		</div>
		<div class="flex gap-2">
			<Select.Root type="multiple" name="favoriteFruit" bind:value={categoryFilters}>
				<Select.Trigger class="">
					<div class="flex items-center gap-2 font-bold text-white">
						<Funnel class="h-4 w-4" />
						Filter Categories
					</div>
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Available Filters</Select.Label>
						{#each availableCategoryFilters as filter (filter.value)}
							<Select.Item value={filter.value} label={filter.label}>
								{filter.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline" size="sm" class="border-border/40 bg-transparent">
						<ArrowUpDown class="h-4 w-4" />
						Sort by: {getSortName(sort)}
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item onSelect={() => updateSort('onlinePlayers')}
						>Online Users</DropdownMenu.Item
					>
					<DropdownMenu.Item onSelect={() => updateSort('votes')}>Votes</DropdownMenu.Item>
					<DropdownMenu.Item onSelect={() => updateSort('name')}>Name</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each servers as server, idx}
			{@const filterActive = categoryFilters.length > 0}
			{#if !filterActive || server.tags
					?.split(',')
					.some((tag) => categoryFilters.includes(tag.toLowerCase()))}
				<Card.Root
					class="gap-4 {server.trending
						? 'border-orange-300/15 bg-orange-900/30'
						: 'border-card-foreground/15 bg-card/50'}"
				>
					<Card.Header>
						<div class="mb-2 w-fit rounded-lg bg-card-foreground/10 px-2 py-1 font-mono text-sm">
							#{idx + 1}
						</div>
						<a href="/server/{server.id}" class="block">
							<div class="mb-4 flex items-center gap-4">
								{#if server.trending}
									<TrendingWrapper>
										<div
											class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-primary/10 p-1"
										>
											<img
												src="/server/{server.id}/logo"
												alt={server.name}
												class="h-full w-full object-contain"
											/>
										</div>
									</TrendingWrapper>
								{:else}
									<div
										class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-primary/10 p-1"
									>
										<img
											src="/server/{server.id}/logo"
											alt={server.name}
											class="h-full w-full object-contain"
										/>
									</div>
								{/if}
								<div class="min-w-0 flex-1">
									<h3
										class="truncate text-xl font-bold text-foreground transition-colors group-hover:text-primary"
									>
										{server.name}
									</h3>
									<div class="flex flex-row items-center gap-1">
										<div
											class="h-2.5 w-2.5 rounded-full {server.onlinePlayers < 0
												? 'bg-red-500'
												: 'bg-green-500'}"
										></div>
										<p class="text-sm">
											{server.onlinePlayers < 0
												? 'server offline'
												: server.onlinePlayers.toLocaleString('en-US') + ' players online'}
										</p>
									</div>
								</div>
							</div>
						</a>
						<div class="mb-1 line-clamp-1 px-1 text-sm text-muted-foreground">
							<p class="truncate">{server.description}</p>
						</div>
					</Card.Header>
					<Card.Content>
						<div
							class="mb-4 grid {server.registeredPlayers > -1
								? 'grid-cols-3'
								: 'grid-cols-2'} gap-2 rounded-lg border bg-secondary/50 p-3"
						>
							<div
								class="text-center {server.registeredPlayers > -1 ? '' : 'border-r border-border'}"
							>
								<p class="mb-1 text-xs text-muted-foreground">Online</p>
								<p class="text-sm font-bold text-foreground">
									{Math.max(server.onlinePlayers, 0).toLocaleString('en-US')}
								</p>
							</div>
							{#if server.registeredPlayers > -1}
								<div class="border-x border-border text-center">
									<p class="mb-1 text-xs text-muted-foreground">Registered</p>
									<p class="text-sm font-bold text-foreground">
										{Math.max(server.registeredPlayers, 0).toLocaleString('en-US')}
									</p>
								</div>
							{/if}
							<div class="text-center">
								<p class="mb-1 text-xs text-muted-foreground">Votes</p>
								<p class="text-sm font-bold text-foreground">
									{server.votes.toLocaleString('en-US')}
								</p>
							</div>
						</div>
						<div class="mb-2 flex flex-wrap gap-2">
							{#each server.tags?.split(',') as tag}
								<span
									class="inline-block rounded-full border bg-gray-800 px-2 py-0.5 text-xs font-medium"
									>{tag}</span
								>
							{/each}
						</div>
						<div class="grid grid-cols-1 gap-2 pt-3 xl:grid-cols-3">
							<Button
								variant="secondary"
								class="border border-border"
								size="sm"
								href={server.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Globe class="mr-1 h-3 w-3" />
								Website
								<ExternalLink class="size-2.5 -translate-x-0.5 -translate-y-[3px]" />
							</Button>
							{#if server.discordUrl && server.discordUrl.length > 0}
								<Button
									variant="outline"
									class="bg-[#5865F2] text-white hover:bg-[#4752C4] hover:text-white"
									size="sm"
									href={server.discordUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<svg
										class="mr-1 h-3 w-3 fill-current"
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
							<Button variant="outline" size="sm" href="/server/{server.id}">
								<List class="mr-1 h-4 w-4" />
								Details
							</Button>
							<Button variant="default" size="sm" href="/server/{server.id}?vote">
								<Vote class="mr-1 h-4 w-4" />
								Vote
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		{/each}
	</div>
</main>
