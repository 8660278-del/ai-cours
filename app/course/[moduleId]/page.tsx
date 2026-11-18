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
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courseModules, getModuleById } from "@/lib/course-data";
import {
  getModulePercent,
  getModuleStatus,
  isLessonCompleted,
  isModuleUnlocked,
} from "@/lib/progress";
import { loadProgress } from "@/lib/progress-service";
import {
  LessonStatusBadge,
  ModuleStatusBadge,
} from "@/components/module-status-badge";

export const dynamic = "force-dynamic";

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const courseModule = getModuleById(moduleId);

  if (!courseModule) {
    notFound();
  }

  const progress = await loadProgress();
  const status = getModuleStatus(courseModule, progress);
  const locked = !isModuleUnlocked(courseModule.id, progress);
  const percent = getModulePercent(courseModule, progress);
  const completedLessons = courseModule.lessons.filter((lesson) =>
    isLessonCompleted(progress, lesson.id)
  ).length;
  const previous = courseModules[courseModule.order - 2];
  const nextLesson =
    courseModule.lessons.find((lesson) => !isLessonCompleted(progress, lesson.id)) ??
    courseModule.lessons[0];

  return (
    <div className="bg-[#f6f5f2]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href="/course"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Программа курса
        </Link>

        <header className="mt-5 border-b border-black/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Модуль {courseModule.order}
            </p>
            <ModuleStatusBadge status={status} locked={locked} />
          </div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {courseModule.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Цель модуля:</span>{" "}
            {courseModule.goal}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {courseModule.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              {courseModule.lessons.length} уроков
            </span>
            <span>
              Пройдено {completedLessons} из {courseModule.lessons.length}
            </span>
          </div>
        </header>

        {locked ? (
          <div className="mt-8 space-y-6">
            <section className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f1ec] text-foreground">
                  <Lock className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Модуль пока закрыт
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Модули открываются последовательно. Чтобы получить доступ к
                    этому модулю, сначала завершите модуль {previous.order} «
                    {previous.title}». Завершённые модули остаются доступными
                    для повторного прохождения.
                  </p>
                  <Link
                    href={`/course/${previous.id}`}
                    className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f36f21] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d95c16]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Перейти к модулю {previous.order}
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <ListChecks className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Что будет в модуле
                </h2>
              </div>
              <ul className="mt-4 space-y-2">
                {courseModule.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-start gap-2.5 rounded-lg border border-black/5 bg-[#fbfaf7] px-3 py-2.5"
                  >
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span>
                      <span className="block text-xs text-muted-foreground">
                        Урок {lesson.numberLabel} · {lesson.duration}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {lesson.title}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <section className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Прогресс модуля
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                      {percent}%
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#e8e5df]">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        status === "completed" ? "bg-[#171717]" : "bg-[#f36f21]"
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {status === "completed"
                      ? "Модуль завершён. Его можно пройти повторно в любое время."
                      : `Пройдено ${completedLessons} из ${courseModule.lessons.length} уроков.`}
                  </p>
                </div>
                <Link
                  href={`/course/${courseModule.id}/${nextLesson.id}`}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f36f21] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d95c16]"
                >
                  {status === "completed"
                    ? "Начать повторение"
                    : completedLessons === 0
                      ? "Начать модуль"
                      : "Продолжить модуль"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            <section
              id="intro"
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Введение
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-foreground/80">
                {courseModule.intro}
              </p>
            </section>

            <section
              id="goal"
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#fff7f1] text-[#c8560f]">
                  <Target className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  Цель и ожидаемые результаты
                </h2>
              </div>
              <p className="mt-3 text-[15px] leading-7 text-foreground/80">
                {courseModule.goal}
              </p>
              <ul className="mt-4 space-y-2.5">
                {courseModule.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex gap-2.5 text-[15px] leading-7"
                  >
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#f36f21]" />
                    <span className="text-foreground/80">{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              id="content"
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Содержание модуля
              </h2>
              <ol className="mt-4 space-y-2.5">
                {courseModule.content.map((item, index) => (
                  <li
                    key={item}
                    className="flex gap-3 text-[15px] leading-7 text-foreground/80"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f3f1ec] text-xs font-semibold text-foreground">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </section>

            <section id="lessons" className="scroll-mt-24">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Уроки модуля
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Каждый урок открывается отдельно и завершается после
                    выполнения задания.
                  </p>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-black/10 overflow-hidden rounded-xl border border-black/10 bg-white">
                {courseModule.lessons.map((lesson) => {
                  const completed = isLessonCompleted(progress, lesson.id);

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/course/${courseModule.id}/${lesson.id}`}
                        className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[#fbfaf7] sm:px-5"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-black/10 bg-[#f9f8f5] text-sm font-semibold text-foreground">
                          {lesson.numberLabel}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground sm:text-base">
                            {lesson.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </span>
                        <LessonStatusBadge completed={completed} />
                        <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section
              id="summary"
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Резюме
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-foreground/80">
                {courseModule.summary}
              </p>
            </section>

            <section
              id="memo"
              className="scroll-mt-24 rounded-xl bg-[#171717] p-5 text-white sm:p-6"
            >
              <h2 className="text-lg font-semibold tracking-tight">
                Памятка с ключевыми выводами
              </h2>
              <ul className="mt-4 space-y-2.5">
                {courseModule.memo.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[15px] leading-7 text-white/80"
                  >
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f36f21]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
