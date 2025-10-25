<script lang="ts">
	import * as Card from '@/components/ui/card';
	import Activity from '@lucide/svelte/icons/activity';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { LoginResponse } from './types';
	import { user } from '@/global';

	const username = $state('');
	const password = $state('');

	const handleLogin = async () => {
		const formData = new FormData();
		formData.append('username', username);
		formData.append('password', password);

		const response = await fetch('/admin/login', {
			method: 'POST',
			body: formData
		});

		const responseData = (await response.json()) as LoginResponse;

		if (response.ok && responseData.success) {
			toast.success('Login successful!');
			user.set(responseData.user);
			await goto('/admin');
		} else {
			toast.error(responseData.message ?? 'Login failed. Please try again.');
		}
	};
</script>

<div class="h-[calc(100vh-10rem)]">
	<div class="flex h-full flex-col items-center justify-center gap-2 p-3">
		<div class="mb-4 flex flex-col items-center text-center text-foreground/80">
			<div
				class="mb-4 flex size-20 items-center justify-center rounded-lg border border-border bg-card"
			>
				<Activity class="h-10 w-10 text-primary" />
			</div>
			<h1 class="mb-2 text-3xl leading-4 font-bold">Admin Panel</h1>
			<div class="max-w-md">
				<p class="text-sm">Sign in to manage osu! servers</p>
			</div>
		</div>
		<Card.Root class="min-w-md border-card-foreground/15 bg-card/50">
			<Card.Header>
				<Card.Title class="text-lg leading-4">Welcome back</Card.Title>
				<Card.Description>Please enter your credentials to sign in.</Card.Description>
			</Card.Header>
			<Card.Content>
				<form class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<Label for="username">Username</Label>
						<Input id="username" type="text"></Input>
					</div>
					<div class="flex flex-col gap-2">
						<Label for="password">Password</Label>
						<Input id="password" type="password"></Input>
					</div>
					<Button onclick={handleLogin}>Login</Button>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</div>
