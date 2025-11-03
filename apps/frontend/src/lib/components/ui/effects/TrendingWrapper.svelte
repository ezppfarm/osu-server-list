<script lang="ts">
	import { cn } from '$lib/utils';
	import Flame from '@lucide/svelte/icons/flame';

	interface Particle {
		id: string;
		x: string;
		y: string;
		color: string;
		delay: number;
		scale: number;
	}

	let {
		children,
		count = 5,
		colors = ['#ff0000', '#ff5a00', '#ff9a00', '#ffce00', '#ffe808'],
		class: className = ''
	}: {
		children?: any;
		count?: number;
		colors?: string[];
		class?: string;
	} = $props();

	function isTooClose(x1: number, y1: number, x2: number, y2: number, minDist: number) {
		const dx = x1 - x2;
		const dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy) < minDist;
	}

	const randomFrom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

	let particles: Particle[] = [];
	const minDistance = 25;
	let attempts = 0;

	while (particles.length < count && attempts < count * 20) {
		attempts++;
		const particleX = -20 + Math.random() * 100;
		const particleY = -15 + Math.random() * 100;
		const tooClose = particles.some((s) =>
			isTooClose(Number.parseFloat(s.x), Number.parseFloat(s.y), particleX, particleY, minDistance)
		);
		if (tooClose) continue;

		const color = randomFrom(colors);
		const delay = Math.random() * 2;
		const scale = Math.random() * 1;
		const id = `${particleX}-${particleY}-${Date.now()}-${Math.random()}`;

		particles.push({
			id,
			x: `${particleX}%`,
			y: `${particleY}%`,
			color,
			delay,
			scale
		});
	}
</script>

<div class={cn('relative inline-block', className)}>
	{@render children?.()}

	{#each particles as item (item.id)}
		<div
			class="particle pointer-events-none absolute z-20"
			id={item.id}
			style="left: {item.x}; top: {item.y}; color: {item.color}; animation-delay: {item.delay}s; transform: scale({item.scale});"
		>
			<!-- <svg width="13" height="13" viewBox="0 0 21 21">
				<path
					d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
					fill={item.color}
				/>
			</svg> -->
			<Flame class="size-5" />
		</div>
	{/each}
</div>

<style lang="postcss">
	.particle {
		animation: particle-fade 1.2s linear infinite;
		opacity: 0;
	}

	@keyframes particle-fade {
		0% {
			opacity: 0;
			transform: scale(0) translateY(20px);
		}
		20% {
			opacity: 1;
			transform: scale(1) translateY(10px);
		}
		80% {
			opacity: 1;
			transform: scale(1) translateY(00px);
		}
		100% {
			opacity: 0;
			transform: scale(0) translateY(-40px);
		}
	}
</style>
