import type { Item, GetItemsParams, GetItemsResponse } from "../types";

const API_URL = "http://localhost:3000/api/items";

export const apiService = {
	async getItems(params: GetItemsParams = {}): Promise<GetItemsResponse> {
		const url = new URL(API_URL);

		if (params.search) url.searchParams.append("search", params.search);
		if (params.sortBy) url.searchParams.append("sortBy", params.sortBy);
		if (params.order) url.searchParams.append("order", params.order);
		if (params.page)
			url.searchParams.append("page", params.page.toString());
		if (params.limit)
			url.searchParams.append("limit", params.limit.toString());

		const response = await fetch(url.toString());
		if (!response.ok) throw new Error("Erro ao buscar itens");
		return response.json();
	},

	async addItem(item: Omit<Item, "id" | "createdAt">): Promise<Item> {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(item),
		});
		if (!response.ok) throw new Error("Erro ao adicionar item");
		return response.json();
	},

	async updateItem(updatedItem: Item): Promise<Item> {
		const response = await fetch(`${API_URL}/${updatedItem.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedItem),
		});
		if (!response.ok) throw new Error("Erro ao atualizar item");
		return response.json();
	},

	async deleteItem(id: number): Promise<{ success: boolean }> {
		const response = await fetch(`${API_URL}/${id}`, {
			method: "DELETE",
		});
		if (!response.ok) throw new Error("Erro ao excluir item");
		return response.json();
	},
};
