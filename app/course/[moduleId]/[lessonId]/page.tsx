import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ListChecks,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courseModules, getLessonById, getModuleById } from "@/lib/course-data";
import {
  getAdjacentLessons,
  getModulePercent,
  isLessonCompleted,
  isModuleUnlocked,
} from "@/lib/progress";
import { loadProgress } from "@/lib/progress-service";
import { LessonStatusBadge } from "@/components/module-status-badge";
import { LessonBlocks } from "@/components/lesson-blocks";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleId, lessonId } = await params;
  const courseModule = getModuleById(moduleId);
  const lesson = getLessonById(moduleId, lessonId);

  if (!courseModule || !lesson) {
    notFound();
  }

  const progress = await loadProgress();
  const locked = !isModuleUnlocked(courseModule.id, progress);
  const completed = isLessonCompleted(progress, lesson.id);
  const { previous, next } = getAdjacentLessons(courseModule.id, lesson.id);
  const nextLocked = next ? !isModuleUnlocked(next.module.id, progress) : false;
  const modulePercent = getModulePercent(courseModule, progress);
  const previousModule = courseModules[courseModule.order - 2];

  if (locked) {
    return (
      <div className="bg-[#f6f5f2]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/course"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Программа курса
          </Link>
          <div className="mt-6 rounded-xl border border-black/10 bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f3f1ec] text-foreground">
              <Lock className="h-5 w-5" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Урок пока недоступен
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Модуль {courseModule.order} «{courseModule.title}» откроется после завершения
              модуля {previousModule.order} «{previousModule.title}». Сначала
              завершите предыдущий модуль — после этого все его уроки и
              следующий модуль станут доступны.
            </p>
            <Link
              href={`/course/${previousModule.id}`}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f36f21] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d95c16]"
            >
              <ArrowLeft className="h-4 w-4" />
              Перейти к модулю {previousModule.order}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f5f2]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <nav
          aria-label="Хлебные крошки"
          className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href="/course" className="hover:text-foreground">
            Программа курса
          </Link>
          <span aria-hidden="true">/</span>
          <Link href={`/course/${courseModule.id}`} className="hover:text-foreground">
            Модуль {courseModule.order}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">Урок {lesson.numberLabel}</span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <header className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Модуль {courseModule.order} · Урок {lesson.numberLabel}
                </p>
                <LessonStatusBadge completed={completed} />
              </div>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                {lesson.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {lesson.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {courseModule.title}
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {lesson.goal}
              </p>
            </header>

            <LessonBlocks
              lessonId={lesson.id}
              blocks={lesson.blocks}
              completedTaskIds={progress.completedTasks}
            />

            <nav
              aria-label="Переход между уроками"
              className="mt-8 grid gap-3 border-t border-black/10 pt-6 sm:grid-cols-2"
            >
              {previous ? (
                <Link
                  href={`/course/${previous.module.id}/${previous.lesson.id}`}
                  className="group flex items-start gap-3 rounded-xl border border-black/10 bg-white p-4 transition-colors hover:border-black/30"
                >
                  <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                  <span>
                    <span className="block text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Предыдущий урок
                    </span>
                    <span className="mt-1 block text-sm font-medium text-foreground">
                      {previous.lesson.numberLabel}. {previous.lesson.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Модуль {previous.module.order}
                    </span>
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {next ? (
                nextLocked ? (
                  <div className="flex items-start gap-3 rounded-xl border border-dashed border-black/15 bg-[#f9f8f5] p-4">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      <span className="block text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Следующий урок
                      </span>
                      <span className="mt-1 block text-sm font-medium text-foreground">
                        {next.lesson.numberLabel}. {next.lesson.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        Откроется после завершения модуля {courseModule.order}.
                      </span>
                    </span>
                  </div>
                ) : (
                  <Link
                    href={`/course/${next.module.id}/${next.lesson.id}`}
                    className="group flex items-start justify-between gap-3 rounded-xl border border-black/10 bg-white p-4 text-right transition-colors hover:border-black/30 sm:col-start-2"
                  >
                    <span>
                      <span className="block text-xs uppercase tracking-[0.12em] text-muted-foreground">
                        Следующий урок
                      </span>
                      <span className="mt-1 block text-sm font-medium text-foreground">
                        {next.lesson.numberLabel}. {next.lesson.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        Модуль {next.module.order}
                      </span>
                    </span>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )
              ) : (
                <Link
                  href="/progress"
                  className="group flex items-start justify-between gap-3 rounded-xl border border-black/10 bg-white p-4 text-right transition-colors hover:border-black/30 sm:col-start-2"
                >
                  <span>
                    <span className="block text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Это последний урок
                    </span>
                    <span className="mt-1 block text-sm font-medium text-foreground">
                      Посмотреть итоги курса
                    </span>
                  </span>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </nav>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Оглавление модуля
                  </p>
                  <span className="text-xs font-medium text-foreground">
                    {modulePercent}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e8e5df]">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      modulePercent === 100 ? "bg-[#171717]" : "bg-[#f36f21]"
                    )}
                    style={{ width: `${modulePercent}%` }}
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  Модуль {courseModule.order}. {courseModule.title}
                </p>
                <ol className="mt-3 space-y-1">
                  {courseModule.lessons.map((item) => {
                    const itemCompleted = isLessonCompleted(progress, item.id);
                    const current = item.id === lesson.id;

                    return (
                      <li key={item.id}>
                        <Link
                          href={`/course/${courseModule.id}/${item.id}`}
                          aria-current={current ? "page" : undefined}
                          className={cn(
                            "flex items-start gap-2 rounded-md px-2 py-1.5 text-xs leading-5 transition-colors",
                            current
                              ? "bg-[#fff7f1] font-medium text-[#c8560f]"
                              : "text-muted-foreground hover:bg-[#f9f8f5] hover:text-foreground"
                          )}
                        >
                          {itemCompleted ? (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          ) : (
                            <span
                              className={cn(
                                "mt-1 h-2.5 w-2.5 shrink-0 rounded-full border",
                                current
                                  ? "border-[#f36f21] bg-[#f36f21]"
                                  : "border-black/20"
                              )}
                            />
                          )}
                          <span>
                            {item.numberLabel}. {item.title}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
                <Link
                  href={`/course/${courseModule.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                >
                  О модуле
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <ListChecks className="h-3.5 w-3.5" />
                  На этом уроке
                </p>
                <ul className="mt-3 space-y-1">
                  {lesson.blocks.map((block) => (
                    <li key={block.id}>
                      <a
                        href={`#${block.id}`}
                        className="block rounded-md px-2 py-1.5 text-xs leading-5 text-muted-foreground transition-colors hover:bg-[#f9f8f5] hover:text-foreground"
                      >
                        {block.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
