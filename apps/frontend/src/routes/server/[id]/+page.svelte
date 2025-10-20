<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import Globe from '@lucide/svelte/icons/globe';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import ThumbsUp from '@lucide/svelte/icons/thumbs-up';

	const props: PageProps = $props();

	const server = props.data.server;
</script>

{#if server}
	<div class="container mx-auto px-4 py-12">
		<div class="mb-12">
			<Card.Root class="overflow-hidden border-card-foreground/15 bg-card/50">
				<Card.Content class="p-8">
					<div class="flex flex-col gap-8 md:flex-row">
						<div class="flex-shrink-0">
							<div
								class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 border p-1"
							>
								<img
									src={server.iconUrl}
									alt={server.name}
									class="h-full w-full object-cover"
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
										<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
										<span class="text-sm text-muted-foreground"
											>Online · {server.onlinePlayers} players</span
										>
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
										<ExternalLink class="ml-1 h-3 w-3" />
									</Button>
									<Button
										size="sm"
										class="bg-primary text-primary-foreground hover:bg-primary/90"
										href="{server.url}/register"
										target="_blank"
										rel="noopener noreferrer"
									>
										Join Server
										<ExternalLink class="ml-1 h-3 w-3" />
									</Button>
									<Button
										variant="secondary"
										size="sm"
										class="border border-border"
										href="/server/{server.id}/vote"
									>
										<ThumbsUp class="mr-2 h-4 w-4" />
										Vote
									</Button>
								</div>
							</div>

							<p class="leading-relaxed text-muted-foreground">{server.description}</p>

							<div class="flex flex-wrap gap-2">
								{#each server.tags?.split(',') as tag}
									<span
										class="inline-block rounded-full border bg-gray-800 px-2 py-0.5 text-xs font-medium"
										>{tag}</span
									>
								{/each}
							</div>

							<div class="grid grid-cols-2 gap-4 pt-4 md:grid-cols-4">
								<div class="rounded-lg border border-border bg-secondary/50 p-3">
									<p class="mb-1 text-xs text-muted-foreground">Total Players</p>
									<p class="text-xl font-bold text-foreground">
										{server.registeredPlayers.toLocaleString()}
									</p>
								</div>
								<div class="rounded-lg border border-border bg-secondary/50 p-3">
									<p class="mb-1 text-xs text-muted-foreground">Ping</p>
									<p class="text-xl font-bold text-green-500">{server.ping}ms</p>
								</div>
								<div class="rounded-lg border border-border bg-secondary/50 p-3">
									<p class="mb-1 text-xs text-muted-foreground">Uptime</p>
									<p class="text-xl font-bold text-foreground">{server.uptime.uptime}%</p>
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
	</div>
{:else}
    <!-- TODO: Server not found / Internal Server Error -->
	<div class="container mx-auto px-4 py-12"></div>
{/if}
