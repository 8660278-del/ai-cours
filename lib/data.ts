export type ModuleStatus = "completed" | "in_progress" | "not_started";

export type ResourceId = "prompts" | "materials" | "progress";

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessons: number;
  status: ModuleStatus;
  href: string;
}

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
  progress: 42,
  totalModules: 5,
  completedModules: 1,
  totalHours: "14 ч",
};

export const modules: CourseModule[] = [
  {
    id: "module-1",
    title: "Основы ИИ, выбор инструмента и эффективные промпты",
    duration: "2,5 ч",
    lessons: 5,
    status: "completed",
    href: "#modules",
  },
  {
    id: "module-2",
    title: "Документы, регламенты и деловые коммуникации",
    duration: "3 ч",
    lessons: 5,
    status: "in_progress",
    href: "#modules",
  },
  {
    id: "module-3",
    title: "Анализ информации, таблиц и проверка фактов",
    duration: "3,5 ч",
    lessons: 6,
    status: "not_started",
    href: "#modules",
  },
  {
    id: "module-4",
    title: "Идеи, презентации и деловая визуализация",
    duration: "2,5 ч",
    lessons: 5,
    status: "not_started",
    href: "#modules",
  },
  {
    id: "module-5",
    title: "Ежедневные процессы, автоматизация и замер эффекта",
    duration: "2,5 ч",
    lessons: 6,
    status: "not_started",
    href: "#modules",
  },
];

export const currentTask = {
  module: "Модуль 2",
  lesson: "Урок 2.1",
  duration: "20 мин",
  title: "Деловая переписка",
  description:
    "Подготовьте письмо клиенту, ответ на претензию и напоминание коллеге — с проверкой тона и фактической точности.",
  href: "#modules",
};

export const resources: ResourceLink[] = [
  {
    id: "prompts",
    anchor: "prompts",
    title: "Библиотека промптов",
    description:
      "Готовые формулировки для писем, документов, таблиц и презентаций.",
    href: "#prompts",
  },
  {
    id: "materials",
    anchor: "materials",
    title: "Полезные материалы",
    description:
      "Чек-листы, шаблоны и памятки для ежедневной работы с нейросетями.",
    href: "#materials",
  },
  {
    id: "progress",
    anchor: "progress",
    title: "Мой прогресс",
    description: "Завершённые модули, пройденные уроки и выполненные задания.",
    href: "#progress",
  },
];
