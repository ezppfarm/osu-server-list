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
	import type { ServerFull, Server } from '@osu-server-list/db/types';
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
	import { createServer, removeServer, updateServer } from './data.remote';
	import { Textarea } from '@/components/ui/textarea';
	import Checkbox from '@/components/ui/checkbox/checkbox.svelte';
	import type { ServerAdd, ServerEdit } from './types';
	import * as Select from '@/components/ui/select';
	import { value } from 'valibot';

	const props: PageProps = $props();

	let data: ServerFull[] = $state(props.data.servers);

	let selectedServer = $state<ServerFull | undefined>(undefined);
	let deleteServerConfirmation = $state('');
	let deleteServerDialogOpen = $state(false);
	let deleteServerLoading = $state(false);

	let addServerDialogOpen = $state(false);
	let addServerLoading = $state(false);
	let addServerObject = $state<ServerAdd>({
		name: '',
		type: 'BANCHOPY',
		description: '',
		iconUrl: '',
		tags: '',
		trending: false,
		url: '',
		location: ''
	});

	let editServerDialogOpen = $state(false);
	let editServerLoading = $state(false);
	let editServerObject = $state<ServerEdit>({
		id: -1,
		name: '',
		type: 'BANCHOPY',
		description: '',
		iconUrl: '',
		tags: '',
		location: '',
		trending: false,
		url: ''
	});

	const serverTypes = [
		{
			value: 'BANCHOPY',
			label: 'BANCHOPY'
		},
		{
			value: 'RIPPLE',
			label: 'RIPPLE'
		},
		{
			value: 'TITANIC',
			label: 'TITANIC'
		}
	];

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
			cell: ({ row }) => {
				if (row.original.registeredPlayers > -1)
					return `${row.original.onlinePlayers.toLocaleString('en-US')} / ${row.original.registeredPlayers.toLocaleString('en-US')}`;

				return `${row.original.onlinePlayers.toLocaleString('en-US')}`;
			}
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
					delete_enabled: props.data.session?.manage.systemAdmin ?? false,
					onclick_delete: () => {
						selectedServer = row.original;
						deleteServerDialogOpen = true;
					},
					onclick_edit: () => {
						editServerObject = {
							id: row.original.id,
							type: row.original.type,
							description: row.original.description ?? '',
							iconUrl: row.original.iconUrl,
							location: row.original.location ?? '',
							name: row.original.name,
							tags: row.original.tags ?? '',
							trending: row.original.trending === 1 ? true : false,
							url: row.original.url
						};
						editServerDialogOpen = true;
					}
				})
		}
	];

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([{ id: 'name', desc: false }]);
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
		if (!selectedServer || deleteServerLoading || !props.data.session?.manage.systemAdmin) return;
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

	const addServer = async () => {
		if (addServerLoading || !props.data.session?.manage.systemAdmin) return;
		if (addServerObject.name.trim().length <= 0) {
			toast.error('Name cannot be empty');
			return;
		}
		if (addServerObject.url.trim().length <= 0) {
			toast.error('URL cannot be empty');
			return;
		}
		if (addServerObject.iconUrl.trim().length <= 0) {
			toast.error('Icon URL cannot be empty');
			return;
		}
		if (addServerObject.tags.trim().length <= 0) {
			toast.error('Tags cannot be empty');
			return;
		}
		addServerLoading = true;
		const addResult = await createServer(addServerObject);
		if (addResult.code === 200) {
			toast.success(addResult.message);
			data = addResult.servers;
		} else toast.error(addResult.message);
		addServerLoading = false;
		addServerDialogOpen = false;
		addServerObject = {
			name: '',
			type: 'BANCHOPY',
			description: '',
			iconUrl: '',
			tags: '',
			trending: false,
			url: '',
			location: ''
		};
	};

	const editServer = async () => {
		if (
			editServerLoading ||
			(!props.data.session?.manage.systemAdmin &&
				!props.data.session?.manage.manageServers.find(
					(userver) => userver.id === editServerObject.id
				))
		)
			return;
		if (editServerObject.name.trim().length <= 0) {
			toast.error('Name cannot be empty');
			return;
		}
		if (editServerObject.url.trim().length <= 0) {
			toast.error('URL cannot be empty');
			return;
		}
		if (editServerObject.iconUrl.trim().length <= 0) {
			toast.error('Icon URL cannot be empty');
			return;
		}
		if (editServerObject.tags.trim().length <= 0) {
			toast.error('Tags cannot be empty');
			return;
		}
		editServerLoading = true;
		const editResult = await updateServer(editServerObject);
		if (editResult.code === 200) {
			toast.success(editResult.message);
			if (props.data.session.manage.systemAdmin) data = editResult.servers;
			else
				data = editResult.servers.filter((server) =>
					props.data.session?.manage.manageServers.some((userver) => userver.id === server.id)
				);
		} else toast.error(editResult.message);
		editServerLoading = false;
		editServerDialogOpen = false;
		editServerObject = {
			id: -1,
			name: '',
			type: 'BANCHOPY',
			description: '',
			iconUrl: '',
			tags: '',
			trending: false,
			url: '',
			location: ''
		};
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
			<Label for="servername" class="text-right">Confirm by typing the server's name</Label>
			<Input
				disabled={deleteServerLoading}
				id="servername"
				placeholder={selectedServer?.name}
				bind:value={deleteServerConfirmation}
			/>
		</div>
		<Dialog.Footer>
			<Button
				disabled={deleteServerLoading}
				onclick={() => {
					deleteServerDialogOpen = false;
				}}
			>
				Cancel
			</Button>
			<Button disabled={deleteServerLoading} variant="destructive" onclick={deleteServer}>
				Delete server
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Server add dialog -->
<Dialog.Root
	bind:open={addServerDialogOpen}
	onOpenChangeComplete={(val) => {
		if (!val)
			addServerObject = {
				name: '',
				type: 'BANCHOPY',
				description: '',
				iconUrl: '',
				tags: '',
				trending: false,
				url: '',
				location: ''
			};
	}}
>
	<Dialog.Content class="md:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Add Server</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-3">
			<div class="flex flex-col gap-1.5">
				<Label for="name">Name</Label>
				<Input id="name" bind:value={addServerObject.name} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="type">Type</Label>
				<Select.Root type="single" name="type" bind:value={addServerObject.type}>
					<Select.Trigger class="w-full">
						{addServerObject.type}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each serverTypes as serverType}
								<Select.Item value={serverType.value} label={serverType.label}>
									{serverType.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="description">Description</Label>
				<Textarea id="description" bind:value={addServerObject.description} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="url">URL</Label>
				<Input id="url" bind:value={addServerObject.url} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="icon_url">Icon URL</Label>
				<Input id="icon_url" bind:value={addServerObject.iconUrl} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="tags">Tags</Label>
				<Input id="tags" bind:value={addServerObject.tags} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="location">Location</Label>
				<Input id="location" bind:value={addServerObject.location} />
			</div>
			<div class="flex flex-row items-center gap-1.5">
				<Checkbox
					id="trending"
					bind:checked={addServerObject.trending}
					disabled={!props.data.session?.manage.systemAdmin}
				/>
				<Label for="trending">Trending</Label>
			</div>
		</div>
		<Dialog.Footer>
			<Button
				variant="outline"
				onclick={() => {
					addServerDialogOpen = false;
				}}>Cancel</Button
			>
			<Button onclick={addServer} disabled={addServerLoading}>Add Server</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Server edit dialog -->
<Dialog.Root
	bind:open={editServerDialogOpen}
	onOpenChangeComplete={(val) => {
		if (!val)
			editServerObject = {
				id: -1,
				name: '',
				type: 'BANCHOPY',
				description: '',
				iconUrl: '',
				tags: '',
				trending: false,
				url: '',
				location: ''
			};
	}}
>
	<Dialog.Content class="md:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Edit {editServerObject.name}</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-3">
			<div class="flex flex-col gap-1.5">
				<Label for="name">Name</Label>
				<Input id="name" bind:value={editServerObject.name} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="type">Type</Label>
				<Select.Root type="single" name="type" bind:value={editServerObject.type}>
					<Select.Trigger class="w-full">
						{editServerObject.type}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							{#each serverTypes as serverType}
								<Select.Item value={serverType.value} label={serverType.label}>
									{serverType.label}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="description">Description</Label>
				<Textarea id="description" bind:value={editServerObject.description} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="url">URL</Label>
				<Input id="url" bind:value={editServerObject.url} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="icon_url">Icon URL</Label>
				<Input id="icon_url" bind:value={editServerObject.iconUrl} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="tags">Tags</Label>
				<Input id="tags" bind:value={editServerObject.tags} />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="location">Location</Label>
				<Input id="location" bind:value={editServerObject.location} />
			</div>
			<div class="flex flex-row items-center gap-1.5">
				<Checkbox
					id="trending"
					bind:checked={editServerObject.trending}
					disabled={!props.data.session?.manage.systemAdmin}
				/>
				<Label for="trending">Trending</Label>
			</div>
		</div>
		<Dialog.Footer>
			<Button
				variant="outline"
				onclick={() => {
					editServerDialogOpen = false;
				}}>Cancel</Button
			>
			<Button onclick={editServer} disabled={editServerLoading}>Save Server</Button>
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
				{#if props.data.session?.manage.systemAdmin}
					<Button class="ml-auto" onclick={() => (addServerDialogOpen = true)}
						><Plus />Add Server</Button
					>
				{/if}
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
