import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Library,
  PlayCircle,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { course, resources, type ResourceId } from "@/lib/data";
import { courseModules } from "@/lib/course-data";
import {
  getContinueLesson,
  getCourseStats,
  getModulePercent,
  getModuleStatus,
  isLessonCompleted,
  isModuleUnlocked,
} from "@/lib/progress";
import { loadProgress } from "@/lib/progress-service";
import { ModuleStatusBadge } from "@/components/module-status-badge";

export const dynamic = "force-dynamic";

const resourceIcons: Record<ResourceId, LucideIcon> = {
  prompts: Library,
  materials: BookOpen,
  progress: BarChart3,
};

export default async function HomePage() {
  const progress = await loadProgress();
  const stats = getCourseStats(progress);
  const continueRef = getContinueLesson(progress);
  const continueHref = continueRef.allCompleted
    ? "/progress"
    : `/course/${continueRef.module.id}/${continueRef.lesson.id}`;

  return (
    <div className="bg-[#f6f5f2]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Курс · ГК ПИР
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Данное обучение подготовленно с помощью нейросетей и ИИ агентов:{" "}
              <a
                href="https://chatgpt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-black/20 underline-offset-4 transition-colors hover:text-[#f36f21]"
              >
                ChatGPT
              </a>
              ,{" "}
              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-black/20 underline-offset-4 transition-colors hover:text-[#f36f21]"
              >
                Gemini
              </a>
              ,{" "}
              <a
                href="https://notebooklm.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-black/20 underline-offset-4 transition-colors hover:text-[#f36f21]"
              >
                NotebookLM
              </a>
              ,{" "}
              <a
                href="https://lovable.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-black/20 underline-offset-4 transition-colors hover:text-[#f36f21]"
              >
                Lovable
              </a>
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {course.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {course.totalModules} модулей
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {course.totalHours}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Target className="h-4 w-4" />
                Практика в каждом модуле
              </span>
            </div>
          </div>

          <aside
            aria-label="Общий прогресс"
            className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Общий прогресс
                </p>
                <p className="mt-2 text-5xl font-semibold tracking-tight text-foreground">
                  {stats.percent}
                  <span className="ml-0.5 text-2xl">%</span>
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f1ec] text-foreground">
                <BarChart3 className="h-5 w-5" />
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Общий прогресс курса"
              aria-valuenow={stats.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[#e8e5df]"
            >
              <div
                className="h-full rounded-full bg-[#f36f21]"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {stats.completedModules} из {stats.totalModules} модулей
                завершено
              </span>
              <span>
                {stats.completedLessons} из {stats.totalLessons} уроков
              </span>
            </div>

            <div className="mt-5 border-t border-black/10 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {continueRef.allCompleted ? "Курс завершён" : "Следующий шаг"}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {continueRef.allCompleted
                  ? "Все модули пройдены"
                  : `Модуль ${continueRef.module.order} · Урок ${continueRef.lesson.numberLabel}`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {continueRef.allCompleted
                  ? "Можно вернуться к любому уроку или посмотреть итоги."
                  : continueRef.lesson.title}
              </p>
            </div>
          </aside>
        </section>

        <section
          id="current-task"
          className="mt-8 scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:mt-10 sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-4">
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f3f1ec] text-foreground sm:flex">
                <Target className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {continueRef.allCompleted
                    ? "Курс завершён"
                    : "Текущая учебная задача"}
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                  {continueRef.allCompleted
                    ? "Все уроки курса пройдены"
                    : continueRef.lesson.title}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {continueRef.allCompleted
                    ? "Вы завершили все модули. На странице прогресса собраны завершённые уроки и выполненные задания."
                    : continueRef.lesson.goal}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {continueRef.allCompleted
                    ? `${stats.completedLessons} из ${stats.totalLessons} уроков пройдено`
                    : `Модуль ${continueRef.module.order} · Урок ${continueRef.lesson.numberLabel} · ${continueRef.lesson.duration}`}
                </p>
              </div>
            </div>
            <Link
              href={continueHref}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f36f21] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#d95c16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f36f21] focus-visible:ring-offset-2 lg:min-w-56"
            >
              {continueRef.allCompleted
                ? "Посмотреть прогресс"
                : "Продолжить обучение"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section id="modules" className="mt-12 scroll-mt-24">
          <div className="flex flex-col gap-2 border-b border-black/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Программа курса
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Пять модулей · {course.totalHours} · без видео
              </p>
            </div>
            <Link
              href="/course"
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
            >
              Вся программа
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="divide-y divide-black/10">
            {courseModules.map((module) => {
              const status = getModuleStatus(module, progress);
              const locked = !isModuleUnlocked(module.id, progress);
              const completedLessons = module.lessons.filter((lesson) =>
                isLessonCompleted(progress, lesson.id)
              ).length;
              const percent = getModulePercent(module, progress);
              const previous = courseModules[module.order - 2];

              return (
                <li key={module.id} className="py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-black/10 bg-white text-sm font-semibold text-muted-foreground">
                      {String(module.order).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h3 className="text-base font-medium text-foreground">
                          {module.title}
                        </h3>
                        <ModuleStatusBadge status={status} locked={locked} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {module.lessons.length} уроков · {completedLessons}{" "}
                        пройдено
                      </p>
                      {locked ? (
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          Откроется после завершения модуля {previous.order} «
                          {previous.title}»
                        </p>
                      ) : (
                        <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[#e8e5df]">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              status === "completed"
                                ? "bg-[#171717]"
                                : "bg-[#f36f21]"
                            )}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {module.duration}
                      </span>
                      <Link
                        href={`/course/${module.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                      >
                        {locked
                          ? "Почему закрыт"
                          : status === "completed"
                            ? "Повторить"
                            : status === "in_progress"
                              ? "Продолжить"
                              : "Открыть"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="resources" className="mt-12 scroll-mt-24">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Доступно в любой момент
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Дополнительные разделы курса — независимо от прогресса модулей.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resourceIcons[resource.id];

              return (
                <Link
                  key={resource.id}
                  id={resource.anchor}
                  href={resource.href}
                  className="group flex scroll-mt-24 flex-col rounded-xl border border-black/10 bg-white p-5 transition-colors hover:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f36f21] focus-visible:ring-offset-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f1ec] text-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="mt-4 text-base font-medium text-foreground">
                    {resource.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {resource.description}
                  </p>
                  {resource.id === "progress" ? (
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#f36f21]" />
                      {stats.percent}% пройдено
                    </span>
                  ) : (
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Доступно сейчас
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
