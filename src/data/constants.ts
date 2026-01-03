export const ALL_TAGS = [
	"Estudo",
	"Trabalho",
	"Pessoal",
	"Público",
	"Outros",
] as const;
export const ALL_PRIORITIES = ["Baixa", "Média", "Alta"] as const;
export const ALL_CATEGORIES = [
	"Frontend",
	"Backend",
	"DevOps",
	"Design",
	"Documentação",
	"Testes",
	"Outros",
] as const;

export type Tag = (typeof ALL_TAGS)[number];
export type Priority = (typeof ALL_PRIORITIES)[number];
export type Category = (typeof ALL_CATEGORIES)[number];
