import type { Item } from "../types";

// Função para gerar itens aleatórios
const generateItems = (count: number = 50): Item[] => {
	const titles = ["Aprender", "Instalar", "Configurar", "Testar", "Refatorar", "Documentar", "Implantar", "Revisar"];
	const subjects = ["Vue.js", "Vite", "Pinia", "Vue Router", "CSS Grid", "Animations", "Composition API", "TypeScript", "Unit Tests"];
	const categories = ["Frontend", "DevOps", "Documentation", "Testing", "Backend"];
	const allTags = [
		"estudo",
		"configs",
		"trabalho",
		"pessoal",
		"urgente",
		"projeto",
	];

	const items: Item[] = [];
	for (let i = 1; i <= count; i++) {
		const title = titles[Math.floor(Math.random() * titles.length)];
		const subject = subjects[Math.floor(Math.random() * subjects.length)];
		const category =
			categories[Math.floor(Math.random() * categories.length)];

		// Gera 1-3 tags aleatórias
		const numTags = Math.floor(Math.random() * 3) + 1;
		const tags: string[] = [];
		const shuffledTags = [...allTags].sort(() => Math.random() - 0.5);
		for (let j = 0; j < Math.min(numTags, shuffledTags.length); j++) {
			const tag = shuffledTags[j];
			if (tag) tags.push(tag);
		}

		items.push({
			id: i,
			name: `${title} ${subject}`,
			description: `Descrição detalhada do passo ${i} relacionado a ${subject} na categoria ${category}.`,
			category: `${category}`,
			tags,
			createdAt: new Date().toISOString(),
		});
	}
	return items;
};

export const initialItems = generateItems();
