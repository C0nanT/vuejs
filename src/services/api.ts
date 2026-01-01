import { initialItems } from "../data/mockItems";
import type { Item, GetItemsParams, GetItemsResponse } from "../types";

// Simulando um banco de dados em memória
let data: Item[] = [...initialItems];

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
	async getItems(params: GetItemsParams = {}): Promise<GetItemsResponse> {
		await delay();
		let filteredData = [...data];

		const { search, sortBy, order = "asc", page = 1, limit = 10 } = params;

		// Busca (Search)
		if (search) {
			const query = search.toLowerCase();
			filteredData = filteredData.filter(item => 
				item.name.toLowerCase().includes(query) || 
				item.description.toLowerCase().includes(query)
			);
		}

		// Ordenação (Sorting)
		if (sortBy) {
			filteredData.sort((a, b) => {
				const valA = a[sortBy];
				const valB = b[sortBy];
				if (order === "asc") return valA > valB ? 1 : -1;
				return valA < valB ? 1 : -1;
			});
		}

		// Paginação (Pagination)
		const total = filteredData.length;
		const startIndex = (page - 1) * limit;
		const paginatedData = filteredData.slice(startIndex, startIndex + limit);

		return {
			data: paginatedData,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit)
		};
	},

	async addItem(item: Omit<Item, 'id' | 'createdAt'>): Promise<Item> {
		await delay();
		const newItem: Item = {
			...item,
			id: Date.now(),
			createdAt: new Date().toISOString()
		};
		data.unshift(newItem); // Adiciona no início
		return newItem;
	},

	async updateItem(updatedItem: Item): Promise<Item> {
		await delay();
		const index = data.findIndex(i => i.id === updatedItem.id);
		if (index !== -1) {
			data[index] = { ...data[index], ...updatedItem };
			return data[index];
		}
		throw new Error("Item não encontrado");
	},

	async deleteItem(id: number): Promise<{ success: boolean }> {
		await delay();
		data = data.filter(i => i.id !== id);
		return { success: true };
	}
};
