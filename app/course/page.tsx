import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { course } from "@/lib/data";
import { courseModules } from "@/lib/course-data";
import {
  getCourseStats,
  getModulePercent,
  getModuleStatus,
  isLessonCompleted,
  isModuleUnlocked,
} from "@/lib/progress";
import { loadProgress } from "@/lib/progress-service";
import { ModuleStatusBadge } from "@/components/module-status-badge";

export const dynamic = "force-dynamic";

export default async function CourseProgramPage() {
  const progress = await loadProgress();
  const stats = getCourseStats(progress);

  return (
    <div className="bg-[#f6f5f2]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Программа курса
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              Пять модулей — от основ ИИ до ежедневной автоматизации
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {course.title}. Модули открываются последовательно: следующий
              становится доступен после завершения предыдущего, а пройденные
              материалы остаются открытыми для повторения.
            </p>
          </div>

          <aside className="rounded-xl border border-black/10 bg-white p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Общий прогресс
              </p>
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {stats.percent}%
              </p>
            </div>
            <div
              role="progressbar"
              aria-label="Общий прогресс курса"
              aria-valuenow={stats.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#e8e5df]"
            >
              <div
                className="h-full rounded-full bg-[#f36f21]"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-black/10 pt-4 text-center">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Модули
                </dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">
                  {stats.completedModules}/{stats.totalModules}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Уроки
                </dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">
                  {stats.completedLessons}/{stats.totalLessons}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Задания
                </dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">
                  {stats.completedTasks}/{stats.totalTasks}
                </dd>
              </div>
            </dl>
            <Link
              href="/progress"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
            >
              Мой прогресс
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>

        <div className="mt-8 space-y-5 sm:mt-10">
          {courseModules.map((module) => {
            const status = getModuleStatus(module, progress);
            const locked = !isModuleUnlocked(module.id, progress);
            const percent = getModulePercent(module, progress);
            const completedLessons = module.lessons.filter((lesson) =>
              isLessonCompleted(progress, lesson.id)
            ).length;
            const previous = courseModules[module.order - 2];

            return (
              <article
                key={module.id}
                className="overflow-hidden rounded-xl border border-black/10 bg-white"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-[#f9f8f5] text-base font-semibold text-foreground">
                        {String(module.order).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                            {module.title}
                          </h2>
                          <ModuleStatusBadge status={status} locked={locked} />
                        </div>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Цель модуля:
                          </span>{" "}
                          {module.goal}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {module.duration}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Target className="h-3.5 w-3.5" />
                            {module.lessons.length} уроков
                          </span>
                          <span>
                            Пройдено {completedLessons} из{" "}
                            {module.lessons.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {locked ? (
                        <Link
                          href={`/course/${previous.id}`}
                          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#171717] px-4 text-sm font-medium text-white transition-colors hover:bg-black"
                        >
                          <ArrowLeft className="h-4 w-4" />К модулю{" "}
                          {previous.order}
                        </Link>
                      ) : (
                        <Link
                          href={`/course/${module.id}`}
                          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#f36f21] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#d95c16]"
                        >
                          {status === "completed"
                            ? "Повторить модуль"
                            : status === "in_progress"
                              ? "Продолжить модуль"
                              : "Открыть модуль"}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {locked ? (
                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
                      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Модуль пока закрыт
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Чтобы открыть его, сначала завершите модуль{" "}
                          {previous.order} «{previous.title}». Завершённые
                          модули остаются доступными для повторного прохождения.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e8e5df]">
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
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {percent}% модуля пройдено
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-black/10 bg-[#fbfaf7] px-5 py-4 sm:px-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Уроки модуля
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {module.lessons.map((lesson) => {
                      const completed = isLessonCompleted(progress, lesson.id);

                      if (locked) {
                        return (
                          <li
                            key={lesson.id}
                            className="flex items-start gap-2.5 rounded-lg border border-black/5 bg-white px-3 py-2.5"
                          >
                            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="min-w-0">
                              <span className="block text-xs text-muted-foreground">
                                Урок {lesson.numberLabel} · {lesson.duration}
                              </span>
                              <span className="block text-sm text-muted-foreground">
                                {lesson.title}
                              </span>
                            </span>
                          </li>
                        );
                      }

                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/course/${module.id}/${lesson.id}`}
                            className="flex items-start gap-2.5 rounded-lg border border-black/10 bg-white px-3 py-2.5 transition-colors hover:border-black/30"
                          >
                            {completed ? (
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            ) : (
                              <span className="mt-1 h-3 w-3 shrink-0 rounded-full border border-black/20" />
                            )}
                            <span className="min-w-0">
                              <span className="block text-xs text-muted-foreground">
                                Урок {lesson.numberLabel} · {lesson.duration}
                              </span>
                              <span className="block text-sm text-foreground">
                                {lesson.title}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
