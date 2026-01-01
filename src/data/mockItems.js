// Função para gerar itens aleatórios
const generateItems = (count = 50) => {
	const titles = ["Aprender", "Instalar", "Configurar", "Testar", "Refatorar", "Documentar", "Implantar", "Revisar"];
	const subjects = ["Vue.js", "Vite", "Pinia", "Vue Router", "CSS Grid", "Animations", "Composition API", "TypeScript", "Unit Tests"];
	const categories = ["Frontend", "DevOps", "Documentation", "Testing", "Backend"];

	const items = [];
	for (let i = 1; i <= count; i++) {
		const title = titles[Math.floor(Math.random() * titles.length)];
		const subject = subjects[Math.floor(Math.random() * subjects.length)];
		const category = categories[Math.floor(Math.random() * categories.length)];

		items.push({
			id: i,
			name: `${title} ${subject}`,
			description: `Descrição detalhada do passo ${i} relacionado a ${subject} na categoria ${category}.`,
			category: category,
			createdAt: new Date().toISOString()
		});
	}
	return items;
};

export const initialItems = generateItems();
