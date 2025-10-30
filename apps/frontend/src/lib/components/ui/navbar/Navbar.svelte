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
	import { goto } from '$app/navigation';
	import type { ServerManage } from '@osu-server-list/db/types-C9BBRE4F';

	let props: { session?: { user: APIUser; manage: ServerManage } } = $props();
</script>

<header
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
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<div class="cursor-pointer rounded-full bg-white/40 p-[1px] transition hover:bg-white/60">
					<Avatar.Root>
						{#if props.session}
							<Avatar.Image
								src="https://cdn.discordapp.com/avatars/{props.session.user.id}/{props.session.user
									.avatar}.png"
							></Avatar.Image>
						{/if}
						<Avatar.Fallback><User class="p-1" /></Avatar.Fallback>
					</Avatar.Root>
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#if props.session}
					{#if props.session.manage.systemAdmin}
						<DropdownMenu.Item
							class="flex cursor-pointer items-center"
							onclick={() => goto('/admin')}
						>
							<Shield class="text-white" />
							Manage all servers
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
					{/if}
				{/if}
				<DropdownMenu.Item
					class="flex cursor-pointer items-center"
					onclick={() => {
						if (props.session) goto('/api/v1/session/logout');
						else goto('/api/v1/session/authorize');
					}}
				>
					{#if props.session}
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
