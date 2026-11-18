import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courseModules } from "@/lib/course-data";
import {
  getCompletedLessonRefs,
  getCompletedTaskBlocks,
  getContinueLesson,
  getCourseStats,
  getModulePercent,
  getModuleStatus,
  isModuleCompleted,
} from "@/lib/progress";
import { loadProgress } from "@/lib/progress-service";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const progress = await loadProgress();
  const stats = getCourseStats(progress);
  const continueRef = getContinueLesson(progress);
  const completedLessons = getCompletedLessonRefs(progress);
  const completedTasks = getCompletedTaskBlocks(progress);
  const completedModules = courseModules.filter((module) =>
    isModuleCompleted(module, progress)
  );

  return (
    <div className="bg-[#f6f5f2]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Мой прогресс
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Результаты обучения
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Здесь собраны завершённые модули, пройденные уроки и выполненные
          задания. Прогресс сохраняется на сервере и восстанавливается при
          следующем открытии курса.
        </p>

        <section
          aria-label="Общий прогресс"
          className="mt-8 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Общий процент прохождения
              </p>
              <p className="mt-2 text-6xl font-semibold tracking-tight text-foreground">
                {stats.percent}
                <span className="ml-1 text-3xl">%</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {stats.completedLessons} из {stats.totalLessons} уроков пройдено
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3f1ec] text-foreground">
              <BarChart3 className="h-6 w-6" />
            </span>
          </div>

          <div
            role="progressbar"
            aria-label="Общий прогресс курса"
            aria-valuenow={stats.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-[#e8e5df]"
          >
            <div
              className="h-full rounded-full bg-[#f36f21]"
              style={{ width: `${stats.percent}%` }}
            />
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-black/10 bg-[#fbfaf7] p-4">
              <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                Модули
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-foreground">
                {stats.completedModules}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {stats.totalModules}
                </span>
              </dd>
            </div>
            <div className="rounded-lg border border-black/10 bg-[#fbfaf7] p-4">
              <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                Уроки
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-foreground">
                {stats.completedLessons}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {stats.totalLessons}
                </span>
              </dd>
            </div>
            <div className="rounded-lg border border-black/10 bg-[#fbfaf7] p-4">
              <dt className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                Задания
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-foreground">
                {stats.completedTasks}
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {stats.totalTasks}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        {stats.completedLessons === 0 ? (
          <section className="mt-8 rounded-xl border border-black/10 bg-white px-6 py-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f1ec] text-muted-foreground">
              <Target className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              Пока нет прогресса
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Начните с первого урока первого модуля. После выполнения задания
              урок будет отмечен пройденным, а результаты появятся на этой
              странице.
            </p>
            <Link
              href={`/course/${continueRef.module.id}/${continueRef.lesson.id}`}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f36f21] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d95c16]"
            >
              Перейти к первому уроку
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <div className="mt-8 space-y-6">
            <section>
              <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-3">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Завершённые модули
                </h2>
                <Link
                  href="/course"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Вся программа
                </Link>
              </div>

              {completedModules.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-black/15 bg-white px-4 py-5 text-sm text-muted-foreground">
                  Завершённых модулей пока нет. Модуль считается завершённым,
                  когда пройдены все его уроки.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {completedModules.map((module) => (
                    <li
                      key={module.id}
                      className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#171717] text-sm font-semibold text-white">
                          {String(module.order).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {module.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {module.lessons.length} уроков · {module.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {getModulePercent(module, progress)}% пройдено
                        </span>
                        <Link
                          href={`/course/${module.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                        >
                          Повторить
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-3">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Пройденные уроки
                </h2>
                <span className="text-sm text-muted-foreground">
                  {completedLessons.length} из {stats.totalLessons}
                </span>
              </div>
              <ul className="mt-4 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10 bg-white">
                {completedLessons.map((ref) => (
                  <li key={ref.lesson.id}>
                    <Link
                      href={`/course/${ref.module.id}/${ref.lesson.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fbfaf7]"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground">
                          {ref.lesson.numberLabel}. {ref.lesson.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          Модуль {ref.module.order}. {ref.module.title}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {ref.lesson.duration}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-3">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Выполненные задания
                </h2>
                <span className="text-sm text-muted-foreground">
                  {completedTasks.length} из {stats.totalTasks}
                </span>
              </div>
              {completedTasks.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-black/15 bg-white px-4 py-5 text-sm text-muted-foreground">
                  Выполненных заданий пока нет.
                </p>
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {completedTasks.map((task) => {
                    const moduleStatus = getModuleStatus(task.module, progress);

                    return (
                      <li
                        key={task.taskId}
                        className="rounded-xl border border-black/10 bg-white p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#fff7f1] text-[#c8560f]">
                            <ClipboardCheck className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {task.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Урок {task.lesson.numberLabel}.{" "}
                              {task.lesson.title}
                            </p>
                            <p
                              className={cn(
                                "mt-2 inline-flex items-center gap-1 text-xs font-medium",
                                moduleStatus === "completed"
                                  ? "text-emerald-700"
                                  : "text-muted-foreground"
                              )}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Задание выполнено
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/course/${task.module.id}/${task.lesson.id}`}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                        >
                          Открыть урок
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
