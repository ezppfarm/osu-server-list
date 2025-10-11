<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import type { PageProps } from './$types';
	import Circle from '@lucide/svelte/icons/circle';

	const props: PageProps = $props();

	const servers = props.data.servers ?? [];
</script>

<div class="min-h-screen bg-background">
	<header
		class="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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

	<section class="relative overflow-hidden border-b border-border/40 py-24">
		<div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
		<div class="relative container mx-auto px-4 text-center">
			<div
				class="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
			>
				<!-- <TrendingUp class="h-3.5 w-3.5" /> -->
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
			<div class="mt-8 flex items-center justify-center gap-4">
				<Button size="lg" class="bg-primary text-primary-foreground hover:bg-primary/90">
					<!-- <Search class="mr-2 h-4 w-4" /> -->
					Explore Servers
				</Button>
				<Button size="lg" variant="outline" class="border-border/40 bg-transparent">
					Submit Server
				</Button>
			</div>
		</div>
	</section>

	<div class="border-b border-border/40 bg-gray-900/10">
		<div class="container mx-auto px-4 py-6">
			<div class="flex flex-wrap items-center justify-center gap-8 text-sm">
				<div class="flex items-center gap-2">
					<span class="text-muted-foreground">{servers.length} Active Servers</span>
				</div>
				<div class="flex items-center gap-2">
					<!-- <Users class="h-4 w-4 text-primary" /> -->
					<span class="text-muted-foreground">0 Players Online</span>
				</div>
				<div class="flex items-center gap-2">
					<!-- <Clock class="h-4 w-4 text-primary" /> -->
					<span class="text-muted-foreground">Updated 2 minutes ago</span>
				</div>
			</div>
		</div>
	</div>

	<main class="container mx-auto px-4 py-12">
		<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight">Top Servers</h2>
				<p class="text-sm text-muted-foreground">Sorted by online users</p>
			</div>
			<div class="flex gap-2">
				<Button variant="outline" size="sm" class="border-border/40 bg-transparent">
					All Categories
				</Button>
				<Button variant="outline" size="sm" class="border-border/40 bg-transparent">Sort By</Button>
			</div>
		</div>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each servers as server, idx}
				<Card.Root class="gap-4 border-card-foreground/15 bg-card/50">
					<Card.Header>
						<div class="flex flex-row items-center justify-between">
							<div class="relative h-16 w-16 rounded-lg bg-card-foreground/10 p-1">
								<img
									src={server.iconUrl}
									alt={`${server.name} logo`}
									class="h-full w-full rounded-lg object-contain"
								/>
								{#if server.trending}
									<span
										class="absolute -top-2 -right-2 inline-flex items-center rounded-full border border-yellow-600 bg-yellow-900 px-0.5 py-0.5 text-xs font-medium text-primary-foreground"
										>🔥</span
									>
								{/if}
							</div>
							<div class="mb-auto rounded-lg bg-card-foreground/10 px-2 py-1 font-mono text-lg">
								#{idx + 1}
							</div>
						</div>
						<div class="flex flex-col">
							<h3 class="text-lg font-semibold">{server.name}</h3>
							<div class="flex flex-row items-center gap-1">
								<div class="h-2.5 w-2.5 rounded-full {server.onlinePlayers < 0 ? "bg-red-500" : "bg-green-500"}"></div>
								<p class="text-sm">{server.onlinePlayers < 0 ? "server offline" : server.onlinePlayers + "online"} </p>
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
							<Button class="w-full" variant="outline">View Details</Button>
							<Button class="w-full" variant="default">10 Votes</Button>
						</div>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</main>

	<footer class="border-t border-border/40 bg-card/30 py-8">
		<div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
			<p>Built for the osu! community • Not affiliated with ppy</p>
		</div>
	</footer>
</div>
