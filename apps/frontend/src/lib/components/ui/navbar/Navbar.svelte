<script lang="ts">
	import Activity from '@lucide/svelte/icons/activity';
	import { env } from '$env/dynamic/public';
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
	</div>
</header>
