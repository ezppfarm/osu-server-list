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


	const props: PageProps = $props();

	let servers = $state(props.data.servers ?? []);
	let sort = $state('onlinePlayers');
	let sortName = $derived(() => getSortName(sort).toLowerCase());

	function updateSort(value: string) {
		if (browser) {
			localStorage.setItem('sort', value);
		}
		servers = sortServers(servers, value);
		sort = value;
	}

	if (browser) {
		sort = localStorage.getItem('sort') ?? 'onlinePlayers';
	}
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
			<h1 class="mb-6 text-5xl font-bold tracking-tight text-balance lg:text-6xl">
				Your Gateway to
				<span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
					osu! Communities
				</span>
			</h1>
			<p class="mx-auto max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
				Browse, compare, and join thriving osu! private servers. Find communities with custom
				features, unique gameplay modes, and active player bases.
			</p>
		</div>
	</section>

	<div class="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
		<Card.Root class="border-card-foreground/15 bg-card/50">
			<Card.Content class="p-6">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border">
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
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border">
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
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border">
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

	<main class="container mx-auto px-4 py-12">
		<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight">Top Servers</h2>
			</div>
			<div class="flex gap-2">
				<Button variant="outline" size="sm" class="border-border/40 bg-transparent">
					All Categories
				</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="outline" size="sm" class="border-border/40 bg-transparent">
							Sort: {sortName()}
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
									class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-primary/10 border p-1"
								>
									<img
										src={server.iconUrl}
										alt={server.name}
										class="h-full w-full object-contain"
									/>
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
						<div class="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-secondary/50 border p-3">
							<div class="text-center">
								<p class="mb-1 text-xs text-muted-foreground">Online</p>
								<p class="text-sm font-bold text-foreground">
									{server.onlinePlayers.toLocaleString()}
								</p>
							</div>
							<div class="border-x border-border text-center">
								<p class="mb-1 text-xs text-muted-foreground">Registered</p>
								<p class="text-sm font-bold text-foreground">
									{server.registeredPlayers.toLocaleString()}
								</p>
							</div>
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
						<div class="grid grid-cols-3 gap-2 pt-3">
							<Button
								variant="outline"
								size="sm"
								href={server.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								Website
								<ExternalLink class="ml-1 h-3 w-3" />
							</Button>
							<Button size="sm" href="/server/{server.id}">Details</Button>
							<Button variant="secondary" size="sm" class="border border-border" href="/server/{server.id}/vote">Vote</Button>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</main>

	
