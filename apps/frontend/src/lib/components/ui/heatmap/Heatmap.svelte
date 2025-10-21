<script lang="ts">
	import { cn } from '@/utils.js';
	import { getCalendar, getColor } from './heatmap.js';
	import type { Props } from './heatmap.js';
	import * as Tooltip from '@/components/ui/tooltip';

	let {
		data,
		colors = ['#3a3f4a', '#aceebb', '#4ac26b', '#2da44e', '#116329'],
		className = 'Heatmap',
		cellSize = 18,
		year = new Date().getFullYear(),
		lday = true,
		lmonth = true
	}: Props = $props();

	let { max, calendar } = $derived(getCalendar(data, year));

	let current = $state('');

	let handleHover = (date: string) => {
		current = date;
	};

	let handleLeave = () => {
		current = '';
	};
</script>

<table class={cn(className, 'border-spacing-1', 'border-separate')} style="font-size:1em">
	{#if lmonth}
		<thead>
			<tr style="font-size:0.75em">
				<td style="padding-bottom:0.5em">‎</td>
				<td colspan="5">Jan</td>
				<td colspan="4">Feb</td>
				<td colspan="4">Mar</td>
				<td colspan="5">Apr</td>
				<td colspan="4">May</td>
				<td colspan="4">Jun</td>
				<td colspan="5">Jul</td>
				<td colspan="4">Aug</td>
				<td colspan="4">Sep</td>
				<td colspan="5">Oct</td>
				<td colspan="4">Nov</td>
				<td colspan="4">Dec</td>
			</tr>
		</thead>
	{/if}
	<tbody>
		{#each calendar as w, i}
			<tr>
				{#if lday}
					<td style="padding-right:0.5em;font-size:0.75em">
						{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
					</td>
				{/if}
				{#each w as d}
					{#if d}
						<td data-date={d.date} data-value={d.value} tabindex="0">
							<Tooltip.Provider>
								<Tooltip.Root disableCloseOnTriggerClick disableHoverableContent>
									<Tooltip.Trigger>
										<div
											class="rounded-[0.1rem] border border-border brightness-90 hover:brightness-110 transition-all duration-100 ease-in-out"
											style={`width:${cellSize}px;height:${cellSize}px;background:${getColor(colors, max, d.value)}`}
										></div>
									</Tooltip.Trigger>
									<Tooltip.Content>
										<div>
											<strong>{d.value}</strong> players on{' '}
											{new Date(d.date).toLocaleDateString(undefined, {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</div>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						</td>
					{:else}
						<td></td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
