import {
  ArrowRightLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Lightbulb,
  ListChecks,
  Target,
  XCircle,
} from "lucide-react";
import type { CardTone, LessonBlock } from "@/lib/course-data";
import { cn } from "@/lib/utils";
import { LessonCompletion } from "@/components/lesson-completion";
import { LessonInteractive } from "@/components/lesson-interactive";

interface LessonBlocksProps {
  lessonId: string;
  blocks: LessonBlock[];
  completedTaskIds: string[];
}

const cardToneStyles: Record<CardTone, string> = {
  default: "border-black/10 bg-white",
  accent: "border-[#f36f21]/30 bg-[#fff7f1]",
  success: "border-emerald-200 bg-emerald-50",
  warning: "border-amber-200 bg-amber-50",
  danger: "border-red-200 bg-red-50",
};

const cardIconToneStyles: Record<CardTone, string> = {
  default: "bg-[#f3f1ec] text-foreground",
  accent: "bg-[#f36f21]/15 text-[#c8560f]",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
};

const cardTextToneStyles: Record<CardTone, string> = {
  default: "text-foreground/80",
  accent: "text-foreground/80",
  success: "text-emerald-900/85",
  warning: "text-amber-900/85",
  danger: "text-red-900/85",
};

export function LessonBlocks({
  lessonId,
  blocks,
  completedTaskIds,
}: LessonBlocksProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        if (block.type === "text") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3f1ec] text-foreground">
                  <BookOpen className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {block.title}
                </h2>
              </div>
              <div className="mt-4 space-y-3">
                {block.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-7 text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          );
        }

        if (block.type === "card") {
          const tone = block.tone ?? "default";

          return (
            <section
              key={block.id}
              id={block.id}
              className={cn(
                "scroll-mt-24 rounded-xl border p-5 sm:p-6",
                cardToneStyles[tone]
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    cardIconToneStyles[tone]
                  )}
                >
                  <Target className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {block.title}
                </h2>
              </div>
              <p className="mt-3 text-[15px] leading-7 text-foreground/80">
                {block.body}
              </p>
            </section>
          );
        }

        if (block.type === "cards") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3f1ec] text-foreground">
                  <ListChecks className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {block.title}
                </h2>
              </div>
              {block.intro && (
                <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                  {block.intro}
                </p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {block.items.map((item) => {
                  const tone = item.tone ?? "default";

                  return (
                    <div
                      key={item.title}
                      className={cn(
                        "rounded-lg border p-4",
                        cardToneStyles[tone]
                      )}
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p
                        className={cn(
                          "mt-1.5 text-sm leading-6",
                          cardTextToneStyles[tone]
                        )}
                      >
                        {item.body}
                      </p>
                      {item.items && item.items.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {item.items.map((point) => (
                            <li
                              key={point}
                              className={cn(
                                "flex gap-2 text-xs leading-5",
                                cardTextToneStyles[tone]
                              )}
                            >
                              <span
                                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60"
                                aria-hidden="true"
                              />
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        if (block.type === "list") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3f1ec] text-foreground">
                  <ListChecks className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {block.title}
                </h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-7">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#f36f21]" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.type === "steps") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3f1ec] text-foreground">
                  <ArrowRightLeft className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {block.title}
                </h2>
              </div>
              {block.intro && (
                <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                  {block.intro}
                </p>
              )}
              <ol className="mt-5 space-y-4">
                {block.steps.map((step, index) => (
                  <li key={step.title} className="flex gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-foreground/75">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        }

        if (block.type === "comparison") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3f1ec] text-foreground">
                  <ArrowRightLeft className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {block.title}
                </h2>
              </div>
              {block.intro && (
                <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                  {block.intro}
                </p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {block.beforeLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {block.before.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-foreground/75"
                      >
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black/25" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    {block.afterLabel}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {block.after.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "right-wrong") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3f1ec] text-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {block.title}
                </h2>
              </div>
              {block.intro && (
                <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                  {block.intro}
                </p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    {block.rightLabel ?? "Правильно"}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {block.right.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-700">
                    {block.wrongLabel ?? "Неправильно"}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {block.wrong.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-red-900/85"
                      >
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        }

        if (block.type === "template") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 rounded-xl border border-dashed border-[#f36f21]/40 bg-[#fff7f1] p-5 sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f36f21]/15 text-[#c8560f]">
                  <FileText className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {block.title}
                </h2>
              </div>
              {block.description && (
                <p className="mt-3 text-[15px] leading-7 text-foreground/75">
                  {block.description}
                </p>
              )}
              <pre className="mt-4 whitespace-pre-wrap break-words rounded-lg border border-[#f36f21]/20 bg-white p-4 font-sans text-sm leading-6 text-foreground/85">
                {block.body}
              </pre>
              {block.note && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {block.note}
                </p>
              )}
            </section>
          );
        }

        if (block.type === "task") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 overflow-hidden rounded-xl border border-black/15 bg-white"
            >
              <div className="flex items-center gap-2.5 border-b border-black/10 bg-[#171717] px-5 py-4 text-white sm:px-6">
                <ClipboardCheck className="h-5 w-5 text-[#f36f21]" />
                <h2 className="text-base font-semibold tracking-tight sm:text-lg">
                  {block.title}
                </h2>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[15px] leading-7 text-foreground/80">
                  {block.description}
                </p>

                {block.condition && (
                  <div className="mt-4 rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Условие
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground/80">
                      {block.condition}
                    </p>
                  </div>
                )}

                {block.data && block.data.length > 0 && (
                  <div className="mt-4 rounded-lg border border-black/10 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Исходные данные
                    </p>
                    <ul className="mt-3 space-y-2">
                      {block.data.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm leading-6 text-foreground/80"
                        >
                          <span
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f36f21]"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {block.interactiveId && (
                  <div className="mt-5 rounded-lg border border-black/10 bg-[#fbfaf7] p-4 sm:p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Lightbulb className="h-4 w-4 text-[#f36f21]" />
                      Интерактив: выполните задание и проверьте объяснения
                    </p>
                    <div className="mt-4">
                      <LessonInteractive interactiveId={block.interactiveId} />
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Инструкция
                    </p>
                    <ol className="mt-3 space-y-2">
                      {block.instructions.map((item, index) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm leading-6 text-foreground/80"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#171717] text-[11px] font-semibold text-white">
                            {index + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Критерии проверки
                    </p>
                    <ul className="mt-3 space-y-2">
                      {block.criteria.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm leading-6 text-foreground/80"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f36f21]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {block.expected && block.expected.length > 0 && (
                  <div className="mt-4 rounded-lg border border-[#f36f21]/25 bg-[#fff7f1] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#c8560f]">
                      Ожидаемый результат
                    </p>
                    <ul className="mt-3 space-y-2">
                      {block.expected.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm leading-6 text-foreground/80"
                        >
                          <Target className="mt-0.5 h-4 w-4 shrink-0 text-[#c8560f]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {block.reference && (
                  <details className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-emerald-900">
                      {block.reference.title ?? "Эталон для самопроверки"}
                    </summary>
                    <ul className="mt-3 space-y-2">
                      {block.reference.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-sm leading-6 text-emerald-900/85"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                <LessonCompletion
                  lessonId={lessonId}
                  taskId={block.taskId}
                  completed={completedTaskIds.includes(block.taskId)}
                />
              </div>
            </section>
          );
        }

        if (block.type === "memo") {
          return (
            <section
              key={block.id}
              id={block.id}
              className="scroll-mt-24 rounded-xl bg-[#171717] p-5 text-white sm:p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-[#f36f21]">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-semibold tracking-tight">
                  {block.title}
                </h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {block.items.map((item) => (
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
          );
        }

        return null;
      })}
    </div>
  );
}
