<script lang="ts">
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type SortingState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import { createRawSnippet } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Pagination from '$lib/components/ui/pagination';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		FlexRender,
		createSvelteTable,
		renderComponent,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import type { ServerFull } from '@osu-server-list/db/types-C9BBRE4F';
	import type { PageProps } from './$types';
	import DataTableOnlineStatusBadge from './data-table-online-status-badge.svelte';
	import * as Card from '@/components/ui/card';
	import DataTableServerTags from './data-table-server-tags.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronsRight from '@lucide/svelte/icons/chevrons-right';
	import ChevronsLeft from '@lucide/svelte/icons/chevrons-left';
	import Plus from '@lucide/svelte/icons/plus';
	import DataTableActions from './data-table-actions.svelte';
	import * as Dialog from '@/components/ui/dialog';
	import { Label } from '@/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { removeServer } from './data.remote';

	const props: PageProps = $props();

	let data: ServerFull[] = $state(props.data.servers);

	let selectedServer = $state<ServerFull | undefined>(undefined);
	let deleteServerConfirmation = $state('');
	let deleteServerDialogOpen = $state(false);
	let deleteServerLoading = $state(false);

	const columns: ColumnDef<ServerFull>[] = [
		{
			accessorKey: 'name',
			header: 'Server Name'
		},
		{
			header: 'Status',
			cell: ({ row }) =>
				renderComponent(DataTableOnlineStatusBadge, {
					online: row.original.onlinePlayers > -1
				})
		},
		{
			header: 'Players',
			cell: ({ row }) =>
				`${row.original.onlinePlayers} / ${row.original.registeredPlayers.toLocaleString('en-US')}`
		},
		{
			header: 'Server Tags',
			cell: ({ row }) =>
				renderComponent(DataTableServerTags, {
					serverTags: row.original.tags?.split(',') ?? []
				})
		},
		{
			accessorKey: 'actions',
			header: () => {
				const amountHeaderSnippet = createRawSnippet(() => {
					return {
						render: () => `<div class="text-right">Actions</div>`
					};
				});
				return renderSnippet(amountHeaderSnippet);
			},
			cell: ({ row }) =>
				renderComponent(DataTableActions, {
					onclick_delete: () => {
						selectedServer = row.original;
						deleteServerDialogOpen = true;
					},
					onclick_edit: () => {
						alert('edit');
					}
				})
		}
	];

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		}
	});

	const deleteServer = async () => {
		if (!selectedServer) return;
		if (selectedServer.name !== deleteServerConfirmation) {
			toast.error('Delete confirmation does not match');
			return;
		}
		deleteServerLoading = true;
		const deleteResult = await removeServer(selectedServer.id);
		if (deleteResult.code === 200) {
			toast.success(deleteResult.message);
			data = deleteResult.servers;
		} else toast.error(deleteResult.message);
		deleteServerLoading = false;
		deleteServerDialogOpen = false;
		selectedServer = undefined;
		deleteServerConfirmation = '';
	};
</script>

<!-- Server delete dialog-->
<Dialog.Root
	bind:open={deleteServerDialogOpen}
	onOpenChangeComplete={(val) => {
		if (!val) selectedServer = undefined;
	}}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete {selectedServer?.name}?</Dialog.Title>
			<Dialog.Description>This action is not reversible!</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-col gap-1.5">
			<Label for="servername" class="text-right">Confirm by typing the servers name</Label>
			<Input
				id="servername"
				placeholder={selectedServer?.name}
				bind:value={deleteServerConfirmation}
			/>
		</div>
		<Dialog.Footer>
			<Button
				onclick={() => {
					deleteServerDialogOpen = false;
				}}>Cancel</Button
			>
			<Button variant="destructive" onclick={deleteServer}>Delete server</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<div class="mx-auto mt-12 max-w-7xl px-3">
	<Card.Root class="border-card-foreground/15 bg-card/50">
		<Card.Content>
			<div class="flex items-center py-4">
				<Input
					placeholder="Search..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					oninput={(e) => table.getColumn('name')?.setFilterValue(e.currentTarget.value)}
					onchange={(e) => {
						table.getColumn('name')?.setFilterValue(e.currentTarget.value);
					}}
					class="max-w-sm"
				/>
				<Button class="ml-auto"><Plus />Add Server</Button>
			</div>
			<div class="rounded-md border">
				<Table.Root>
					<Table.Header>
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row>
								{#each headerGroup.headers as header (header.id)}
									<Table.Head class={header.id.toLowerCase() === 'actions' ? 'w-0' : ''}>
										{#if !header.isPlaceholder}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body>
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row data-state={row.getIsSelected() && 'selected'}>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell>
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={columns.length} class="text-center">No results.</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
			<div class="mt-2 flex items-center justify-center space-x-2 pt-4">
				<div class="space-x-2">
					<Pagination.Root
						page={table.getState().pagination.pageIndex + 1}
						count={table.getFilteredRowModel().rows.length}
						perPage={10}
						siblingCount={1}
						onPageChange={(page) => {
							table.setPageIndex(page - 1);
						}}
					>
						{#snippet children({ pages, currentPage })}
							<Pagination.Content>
								<Pagination.Item>
									<Pagination.PrevButton
										onclick={() => table.firstPage()}
										disabled={!table.getCanPreviousPage()}
									>
										<ChevronsLeft class="size-4" />
										<span class="hidden sm:block">First</span>
									</Pagination.PrevButton>
								</Pagination.Item>
								<Pagination.Item>
									<Pagination.PrevButton disabled={!table.getCanPreviousPage()}>
										<ChevronLeft class="size-4" />
										<span class="hidden sm:block">Previous</span>
									</Pagination.PrevButton>
								</Pagination.Item>
								{#each pages as page (page.key)}
									{#if page.type === 'ellipsis'}
										<Pagination.Item>
											<Pagination.Ellipsis />
										</Pagination.Item>
									{:else}
										<Pagination.Item>
											<Pagination.Link {page} isActive={currentPage === page.value}>
												{page.value}
											</Pagination.Link>
										</Pagination.Item>
									{/if}
								{/each}
								<Pagination.Item>
									<Pagination.NextButton disabled={!table.getCanNextPage()}>
										<span class="hidden sm:block">Next</span>
										<ChevronRight class="size-4" />
									</Pagination.NextButton>
								</Pagination.Item>
								<Pagination.Item>
									<Pagination.NextButton
										onclick={() => table.lastPage()}
										disabled={!table.getCanNextPage()}
									>
										<span class="hidden sm:block">Last</span>
										<ChevronsRight class="size-4" />
									</Pagination.NextButton>
								</Pagination.Item>
							</Pagination.Content>
						{/snippet}
					</Pagination.Root>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
