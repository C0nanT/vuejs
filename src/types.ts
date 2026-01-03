export interface Item {
	id: number;
	name: string;
	description: string;
	category: string;
	priority: number;
	tags: string[];
	dueDate?: string;
	createdAt: string;
}

export interface FormState {
	id: number | null;
	name: string;
	description: string;
	category: string;
	priority: number;
	tags: string[];
	dueDate?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface GetItemsParams {
	search?: string;
	sortBy?: keyof Item;
	order?: SortOrder;
	page?: number;
	limit?: number;
	tags?: string[];
}

export interface GetItemsResponse {
  data: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
