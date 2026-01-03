import type { Item } from "../types";
import { ALL_CATEGORIES, ALL_PRIORITIES, ALL_TAGS } from "./constants";

// Função para gerar itens aleatórios
const generateItems = (count: number = 50): Item[] => {
	const titles = [
		"Aprender",
		"Instalar",
		"Configurar",
		"Testar",
		"Refatorar",
		"Documentar",
		"Implantar",
		"Revisar",
	];
	const subjects = [
		"Vue.js",
		"Vite",
		"Pinia",
		"Vue Router",
		"CSS Grid",
		"Animations",
		"Composition API",
		"TypeScript",
		"Unit Tests",
	];

	const allCategories = [...ALL_CATEGORIES];
	const allTags = [...ALL_TAGS];
	const allPriorities = [...ALL_PRIORITIES];

	const items: Item[] = [];
	for (let i = 1; i <= count; i++) {
		const title = titles[Math.floor(Math.random() * titles.length)];
		const subject = subjects[Math.floor(Math.random() * subjects.length)];
		const category =
			allCategories[Math.floor(Math.random() * allCategories.length)];

		// Gera 1-3 tags aleatórias
		const numTags = Math.floor(Math.random() * 3) + 1;
		const tags: string[] = [];
		const shuffledTags = [...allTags].sort(() => Math.random() - 0.5);
		for (let j = 0; j < Math.min(numTags, shuffledTags.length); j++) {
			const tag = shuffledTags[j];
			if (tag) tags.push(tag);
		}

		// Gera data limite aleatória (50% dos itens terão data limite)
		let dueDate: string | undefined;
		if (Math.random() > 0.5) {
			const daysOffset = Math.floor(Math.random() * 30) - 10; // -10 a +20 dias
			const date = new Date();
			date.setDate(date.getDate() + daysOffset);
			dueDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format
		}



		// Gera prioridade aleatória (1, 2 ou 3)
		const priority = Math.floor(Math.random() * 3) + 1;

		items.push({
			id: i,
			name: `${title} ${subject}`,
			description: `Descrição detalhada do passo ${i} relacionado a ${subject} na categoria ${category}.`,
			category: `${category}`,
			priority,
			tags,
			dueDate,
			createdAt: new Date().toISOString(),
		});
	}
	return items;
};

export const initialItems = generateItems();
