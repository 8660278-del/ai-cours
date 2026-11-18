import { totalLessons } from "./course-data";

export type { ModuleStatus } from "./progress";

export type ResourceId = "prompts" | "materials" | "progress";

export interface ResourceLink {
  id: ResourceId;
  anchor: string;
  title: string;
  description: string;
  href: string;
}

export const course = {
  title: "Нейросети для работы: как ускорить рутину и повысить продуктивность",
  description:
    "Практический курс для сотрудников ГК ПИР: научитесь ставить задачи нейросетям, безопасно работать с данными и применять готовые шаблоны в ежедневных рабочих процессах.",
  userName: "Анна",
  totalModules: 5,
  totalLessons,
  totalHours: "14 ч",
};

export const resources: ResourceLink[] = [
  {
    id: "prompts",
    anchor: "prompts",
    title: "Библиотека промптов",
    description:
      "Готовые формулировки для писем, документов, таблиц и презентаций.",
    href: "/#prompts",
  },
  {
    id: "materials",
    anchor: "materials",
    title: "Полезные материалы",
    description:
      "Чек-листы, шаблоны и памятки для ежедневной работы с нейросетями.",
    href: "/#materials",
  },
  {
    id: "progress",
    anchor: "progress",
    title: "Мой прогресс",
    description: "Завершённые модули, пройденные уроки и выполненные задания.",
    href: "/progress",
  },
];
