<script lang="ts">
	import Activity from '@lucide/svelte/icons/activity';
	import { env } from '$env/dynamic/public';
	import * as Avatar from '@/components/ui/avatar';
	import User from '@lucide/svelte/icons/user';
	import Logout from '@lucide/svelte/icons/log-out';
	import Shield from '@lucide/svelte/icons/shield';
	import Discord from 'svelte-radix/DiscordLogo.svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { APIUser } from 'discord-api-types/v10';
	import { beforeNavigate, goto } from '$app/navigation';
	import type { ServerManage } from '@osu-server-list/db/types';
	import { page } from '$app/state';
	import LogOut from '@lucide/svelte/icons/log-out';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { Button } from '@/components/ui/button';
	import { navEntries } from './navbar';
	import * as Sheet from '@/components/ui/sheet';
	import MenuIcon from 'svelte-radix/HamburgerMenu.svelte';

	let {
		pathName,
		session
	}: { pathName: string; session?: { user: APIUser; manage: ServerManage } } = $props();

	let isAdminPanel = $derived(page.url.pathname.startsWith('/admin/'));

	let sheetOpen = $state(false);
	let smallerBar = $state(false);

	const handleScroll = () => {
		const bar = window.scrollY >= 120;
		if (bar !== smallerBar) smallerBar = bar;
	};

	beforeNavigate(() => {
		sheetOpen = false;
	});
</script>

<svelte:window onscroll={handleScroll} onresize={() => (sheetOpen = false)} />

<header
	class="fixed top-0 left-0 flex {smallerBar
		? 'h-16'
		: 'h-20'} z-20 w-full shrink-0 items-center justify-between gap-6 border-b border-b-gray-900/50 bg-gray-950/50 px-4 backdrop-blur transition-all md:px-6"
>
	<Sheet.Root bind:open={sheetOpen}>
		<Sheet.Trigger>
			<Button variant="outline" size="icon" class="lg:hidden">
				<MenuIcon className="h-6 w-6" />
				<span class="sr-only">Toggle navigation menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left">
			<a href="/" class="mr-6 flex items-center gap-2 p-5 text-2xl lg:hidden">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
					<Activity class="h-5 w-5 text-primary-foreground" />
				</div>
				<span class="text-lg font-semibold tracking-tight">{env.PUBLIC_APP_NAME}</span>
			</a>
			<div class="grid gap-2 px-3 py-2">
				{#if !isAdminPanel}
					{#each navEntries as navEntry (navEntry)}
						{@const isActive = navEntry.activeRegex.some((regex) => pathName.match(regex))}
						{#if navEntry.subEntries}
							<a
								href={navEntry.href}
								class="flex w-full items-center rounded-lg pt-2 pb-1 text-lg font-semibold transition-all {isActive
									? 'px-3 underline'
									: ''}"
							>
								{navEntry.name}
							</a>
							<div class="flex flex-col">
								{#each navEntry.subEntries as subEntry (subEntry)}
									<a
										href={subEntry.href}
										class="flex w-full items-center py-1 {isActive
											? 'px-6 hover:px-9'
											: 'px-3 hover:px-6'} rounded-lg text-base font-semibold transition-all"
									>
										{subEntry.name}
									</a>
								{/each}
							</div>
						{:else}
							<a
								href={navEntry.href}
								class="flex w-full items-center rounded-lg py-2 text-lg font-semibold transition-all hover:px-3 {isActive
									? 'px-3 underline'
									: ''}"
							>
								{navEntry.name}
							</a>
						{/if}
					{/each}
				{:else}{/if}
			</div>
		</Sheet.Content>
	</Sheet.Root>
	<div class="hidden w-full items-center gap-6 lg:flex">
		<a href="/" class="hidden items-center gap-3 text-2xl lg:flex">
			<div
				class="flex {smallerBar
					? 'size-8'
					: 'size-9'} items-center justify-center rounded-lg bg-primary"
			>
				<Activity
					class="{smallerBar ? 'size-5' : 'size-6'} text-primary-foreground transition-all"
				/>
			</div>
			<span class="text-lg font-semibold tracking-tight text-nowrap">{env.PUBLIC_APP_NAME}</span>
		</a>
		<nav class="ml hidden w-full flex-row justify-between lg:flex">
			<div class="flex gap-3">
				{#if !isAdminPanel}
					{#each navEntries as navEntry (navEntry)}
						{@const isActive = navEntry.activeRegex.some((regex) => pathName.match(regex))}
						{#if navEntry.subEntries}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button class={isActive ? 'bg-accent' : ''} variant="ghost">
										{navEntry.name}
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									{#each navEntry.subEntries as subEntry (subEntry)}
										<a href={subEntry.href}>
											<DropdownMenu.Item class="cursor-pointer">
												{subEntry.name}
											</DropdownMenu.Item>
										</a>
									{/each}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<Button class={isActive ? 'bg-accent' : ''} href={navEntry.href} variant="ghost">
								{navEntry.name}
							</Button>
						{/if}
					{/each}
				{:else}{/if}
			</div>
		</nav>
	</div>
	<div class="flex flex-row gap-6">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="rounded-full bg-white/40 p-[1px] transition hover:bg-white/60">
				{#if session}
					<Avatar.Root style="view-transition-name: user-menu;">
						<Avatar.Image
							src="https://cdn.discordapp.com/avatars/{session.user.id}/{session.user.avatar}.png"
							alt={session.user.global_name}
						/>
						<Avatar.Fallback>
							<LoaderCircle class="animate-spin" />
						</Avatar.Fallback>
					</Avatar.Root>
				{:else}
					<Avatar.Root style="view-transition-name: user-menu;">
						<Avatar.Fallback>
							<User class="size-4" />
						</Avatar.Fallback>
					</Avatar.Root>
				{/if}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="mr-3 w-screen p-0 md:w-48">
				{#if session}
					<div class="p-1">
						{#if session.manage.systemAdmin || session.manage.manageServers.length > 0}
							<a href="/admin">
								<DropdownMenu.Item class="cursor-pointer">
									<Shield />
									Manage {session?.manage.systemAdmin ? 'all' : 'your'} servers
								</DropdownMenu.Item>
							</a>
							<DropdownMenu.Separator></DropdownMenu.Separator>
						{/if}
						<DropdownMenu.Item
							class="cursor-pointer"
							onclick={() => goto('/api/v1/session/logout')}
						>
							<LogOut />
							Logout
						</DropdownMenu.Item>
					</div>
				{:else}
					<div class="p-1">
						<DropdownMenu.Item
							class="cursor-pointer"
							onclick={() => goto('/api/v1/session/authorize')}
						>
							<Discord />
							Login
						</DropdownMenu.Item>
					</div>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>

<!-- Old Navbar -->
<!-- <header
	class="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto flex h-16 items-center justify-between px-4">
		<div class="flex items-center gap-3">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
				<Activity class="h-5 w-5 text-primary-foreground" />
			</div>
			<a href="/" class="flex items-center gap-3">
				<span class="text-lg font-semibold tracking-tight">{env.PUBLIC_APP_NAME}</span>
			</a>
			<nav class="flex items-center gap-6">
				<a
					href="/"
					class="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
				>
					Servers
				</a>
			</nav>
		</div>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<div class="cursor-pointer rounded-full bg-white/40 p-[1px] transition hover:bg-white/60">
					<Avatar.Root>
						{#if session}
							<Avatar.Image
								src="https://cdn.discordapp.com/avatars/{session.user.id}/{session.user.avatar}.png"
							></Avatar.Image>
						{/if}
						<Avatar.Fallback><User class="p-1" /></Avatar.Fallback>
					</Avatar.Root>
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#if session}
					{#if session.manage.systemAdmin || session.manage.manageServers.length > 0}
						<DropdownMenu.Item
							class="flex cursor-pointer items-center"
							onclick={() => goto('/admin')}
						>
							<Shield class="text-white" />
							Manage {session.manage.systemAdmin ? 'all' : 'your'} servers
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
					{/if}
				{/if}
				<DropdownMenu.Item
					class="flex cursor-pointer items-center"
					onclick={() => {
						if (session) goto('/api/v1/session/logout');
						else goto('/api/v1/session/authorize');
					}}
				>
					{#if session}
						<Logout class="text-white" />
						Logout
					{:else}
						<Discord class="text-white" />
						Login
					{/if}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
 -->
