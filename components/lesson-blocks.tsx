import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Lightbulb,
  ListChecks,
  Target,
} from "lucide-react";
import type { LessonBlock } from "@/lib/course-data";
import { cn } from "@/lib/utils";
import { LessonCompletion } from "@/components/lesson-completion";

interface LessonBlocksProps {
  lessonId: string;
  blocks: LessonBlock[];
  completedTaskIds: string[];
}

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
          return (
            <section
              key={block.id}
              id={block.id}
              className={cn(
                "scroll-mt-24 rounded-xl border p-5 sm:p-6",
                block.tone === "accent"
                  ? "border-[#f36f21]/30 bg-[#fff7f1]"
                  : "border-black/10 bg-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md",
                    block.tone === "accent"
                      ? "bg-[#f36f21]/15 text-[#c8560f]"
                      : "bg-[#f3f1ec] text-foreground"
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

                <LessonCompletion
                  lessonId={lessonId}
                  taskId={block.taskId}
                  completed={completedTaskIds.includes(block.taskId)}
                />
              </div>
            </section>
          );
        }

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
      })}
    </div>
  );
}
