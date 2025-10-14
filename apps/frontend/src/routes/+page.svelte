<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import type { PageProps } from './$types';
	import dayjs from 'dayjs';
	import * as Tooltip from '@/components/ui/tooltip';
	import { browser } from '$app/environment';
	import { getSortName, sortServers } from '@/helpers';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';

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

<div class="bg-background min-h-screen">
	<header
		class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur"
	>
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<div class="flex items-center gap-8">
				<a href="/" class="flex items-center gap-3">
					<span class="text-lg font-semibold tracking-tight">osu-server-list</span>
				</a>
				<!-- <nav class="hidden items-center gap-6 md:flex">
					<a
						href="/"
						class="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
					>
						Servers
					</a>
				</nav> -->
			</div>
			<!-- <Button
				variant="outline"
				size="sm"
				class="border-primary/20 bg-transparent hover:bg-primary/10 hover:text-primary"
			>
				Sign In
			</Button> -->
		</div>
	</header>

	<section class="border-border/40 relative overflow-hidden border-b py-24">
		<div class="from-primary/5 absolute inset-0 bg-gradient-to-b to-transparent"></div>
		<div class="container relative mx-auto px-4 text-center">
			<div
				class="border-primary/20 bg-primary/5 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
			>
				<!-- <TrendingUp class="h-3.5 w-3.5" /> -->
				<span>Discover the best osu! private servers</span>
			</div>
			<h1 class="mb-6 text-balance text-5xl font-bold tracking-tight lg:text-6xl">
				Your Gateway to
				<span class="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
					osu! Communities
				</span>
			</h1>
			<p class="text-muted-foreground mx-auto max-w-2xl text-pretty text-lg leading-relaxed">
				Browse, compare, and join thriving osu! private servers. Find communities with custom
				features, unique gameplay modes, and active player bases.
			</p>
			<!-- <div class="mt-8 flex items-center justify-center gap-4">
				<Button size="lg" class="bg-primary text-primary-foreground hover:bg-primary/90">
					Explore Servers
				</Button>
				<Button size="lg" variant="outline" class="border-border/40 bg-transparent">
					Submit Server
				</Button>
			</div> -->
		</div>
	</section>

	<div class="border-border/40 border-b bg-gray-900/10">
		<div class="container mx-auto px-4 py-6">
			<div
				class="flex flex-col flex-wrap items-center justify-center gap-3 text-sm md:flex-row md:gap-8"
			>
				<div class="flex items-center gap-2">
					<span class="text-muted-foreground"
						>{servers.filter((server) => server.onlinePlayers >= 0).length} online servers</span
					>
				</div>
				<div class="flex items-center gap-2">
					<!-- <Users class="h-4 w-4 text-primary" /> -->
					<span class="text-muted-foreground"
						>{servers.reduce((acc, server) => acc + server.onlinePlayers, 0)} players online</span
					>
				</div>
				<div class="flex items-center gap-2">
					<!-- <Clock class="h-4 w-4 text-primary" /> -->
					<span class="text-muted-foreground"
						>Updated {dayjs(servers[0]?.last_update).local().fromNow()}</span
					>
				</div>
			</div>
		</div>
	</div>

	<main class="container mx-auto px-4 py-12">
		<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight">Top Servers</h2>
				<p class="text-muted-foreground text-sm">Sorted by {sortName()}</p>
			</div>
			<div class="flex gap-2">
				<Button variant="outline" size="sm" class="border-border/40 bg-transparent">
					All Categories
				</Button>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="outline" size="sm" class="border-border/40 bg-transparent">
							Sort By
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
				<Card.Root class="border-card-foreground/15 bg-card/50 gap-4">
					<Card.Header>
						<div class="flex flex-row items-center justify-between">
							<div class="bg-card-foreground/10 relative h-16 w-16 rounded-lg p-1">
								<img
									src={server.iconUrl}
									alt={`${server.name} logo`}
									class="h-full w-full rounded-lg object-contain"
								/>
								{#if server.trending}
									<span
										class="text-primary-foreground absolute -right-2 -top-2 inline-flex items-center rounded-full border border-yellow-600 bg-yellow-900 px-0.5 py-0.5 text-xs font-medium"
										>🔥</span
									>
								{/if}
							</div>
							<div class="bg-card-foreground/10 mb-auto rounded-lg px-2 py-1 font-mono">
								#{idx + 1}
							</div>
						</div>
						<div class="flex flex-col">
							<h3 class="text-lg font-semibold">{server.name}</h3>
							<div class="flex flex-row items-center gap-1">
								<div
									class="h-2.5 w-2.5 rounded-full {server.onlinePlayers < 0
										? 'bg-red-500'
										: 'bg-green-500'}"
								></div>
								<p class="text-sm">
									{server.onlinePlayers < 0
										? 'server offline'
										: server.onlinePlayers + ' players online'}
								</p>
							</div>
						</div>
					</Card.Header>
					<Card.Content>
						<div class="mb-2 flex flex-wrap gap-2">
							{#each server.tags?.split(',') as tag}
								<span
									class="inline-block rounded-full border bg-gray-800 px-2 py-0.5 text-xs font-medium"
									>{tag}</span
								>
							{/each}
						</div>
					</Card.Content>
					<Card.Footer>
						<div class="grid w-full grid-cols-1 items-center gap-4 lg:grid-cols-2">
							<Button class="w-full" variant="outline" href={server.url} target="_blank"
								>View Website</Button
							>
							<Tooltip.Provider>
								<Tooltip.Root delayDuration={0} disableCloseOnTriggerClick disableHoverableContent>
									<Tooltip.Trigger>
										<Button class="w-full" variant="default" disabled>{server.votes} Votes</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>soon™</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</div>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</main>

	<footer class="border-border/40 bg-card/30 border-t py-8">
		<div class="text-muted-foreground container mx-auto px-4 text-center text-sm">
			<p>Built for the osu! community • Not affiliated with osu! or ppy Pty Ltd</p>
		</div>
	</footer>
</div>
