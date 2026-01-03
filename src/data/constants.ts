export const ALL_TAGS = [
	"Estudo",
	"Trabalho",
	"Pessoal",
	"Público",
	"Outros",
] as const;
export const PRIORITY_MAP = {
	Baixa: 1,
	Média: 2,
	Alta: 3,
} as const;

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
export type Priority = (typeof PRIORITY_MAP)[keyof typeof PRIORITY_MAP];
export type Category = (typeof ALL_CATEGORIES)[number];
