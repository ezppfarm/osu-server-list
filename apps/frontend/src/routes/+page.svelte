<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import type { PageProps } from './$types';
	import dayjs from 'dayjs';
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
	import type { ServerFull } from '@/types/serverfull';

	const props: PageProps = $props();

	let servers = $state<ServerFull[]>([]);
	let sort = $state('onlinePlayers');
	let sortName = $derived(() => getSortName(sort).toLowerCase());

	function updateSort(value: string) {
		if (!servers) return;
		if (browser) {
			localStorage.setItem('sort', value);
		}
		servers = sortServers(servers, value);
		sort = value;
	}

	onMount(() => {
		sort = localStorage.getItem('sort') ?? 'onlinePlayers';
		servers = sortServers(props.data.servers ?? [], sort);
	});
</script>

<section class="relative overflow-hidden border-b border-border/40 py-24">
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
			<Button variant="outline" size="sm" class="border-border/40 bg-transparent">
				<Funnel class="h-4 w-4" />
				All Categories
			</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline" size="sm" class="border-border/40 bg-transparent">
						<ArrowUpDown class="h-4 w-4" />
						{getSortName(sort)}
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
			<Card.Root class="gap-4 border-card-foreground/15 bg-card/50">
				<Card.Header>
					<div class="mb-2 w-fit rounded-lg bg-card-foreground/10 px-2 py-1 font-mono text-sm">
						#{idx + 1}
					</div>
					<a href="/server/{server.id}" class="block">
						<div class="mb-4 flex items-center gap-4">
							<div
								class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-primary/10 p-1"
							>
								<img src={server.iconUrl} alt={server.name} class="h-full w-full object-contain" />
							</div>
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
											: server.onlinePlayers.toLocaleString() + ' players online'}
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
						class="mb-4 grid {server.type !== 'RIPPLE'
							? 'grid-cols-3'
							: 'grid-cols-2'} gap-2 rounded-lg border bg-secondary/50 p-3"
					>
						<div class="text-center {server.type !== 'RIPPLE' ? '' : 'border-r border-border'}">
							<p class="mb-1 text-xs text-muted-foreground">Online</p>
							<p class="text-sm font-bold text-foreground">
								{server.onlinePlayers.toLocaleString()}
							</p>
						</div>
						{#if server.type !== 'RIPPLE'}
							<div class="border-x border-border text-center">
								<p class="mb-1 text-xs text-muted-foreground">Registered</p>
								<p class="text-sm font-bold text-foreground">
									{server.registeredPlayers.toLocaleString()}
								</p>
							</div>
						{/if}
						<div class="text-center">
							<p class="mb-1 text-xs text-muted-foreground">Votes</p>
							<p class="text-sm font-bold text-foreground">{server.votes.toLocaleString()}</p>
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
		{/each}
	</div>
</main>
