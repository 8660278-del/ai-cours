import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Blocks,
  BookOpen,
  Clock,
  Library,
  ListChecks,
  ShieldCheck,
  Table2,
  Timer,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  materials,
  promptLibraryHref,
  type MaterialIcon,
} from "@/lib/materials-data";

export const metadata: Metadata = {
  title: "Полезные материалы — ГК ПИР",
  description:
    "Словарь терминов ИИ, формула промпта, чек-листы, шаблоны анализа процесса и замера времени, справочник ошибок и матрица выбора инструмента.",
};

const materialIcons: Record<MaterialIcon, LucideIcon> = {
  book: BookOpen,
  blocks: Blocks,
  check: ListChecks,
  shield: ShieldCheck,
  workflow: Workflow,
  timer: Timer,
  alert: AlertTriangle,
  matrix: Table2,
};

export default function MaterialsPage() {
  return (
    <div className="bg-[#f6f5f2]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="border-b border-black/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Полезные материалы
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            Памятки, чек-листы и шаблоны для ежедневной работы
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Восемь материалов, которые можно открыть в любой момент независимо
            от прогресса модулей. Каждый открывается отдельно, читается на
            телефоне и компьютере, а шаблоны и чек-листы можно скопировать.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-muted-foreground">
            <Library className="h-3.5 w-3.5 text-[#f36f21]" />
            {materials.length} материалов · доступны без прохождения уроков
          </div>
        </header>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => {
            const Icon = materialIcons[material.icon];

            return (
              <li key={material.slug}>
                <Link
                  href={`/materials/${material.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-black/10 bg-white p-5 transition-colors hover:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f36f21] focus-visible:ring-offset-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f1ec] text-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-black/10 bg-[#fbfaf7] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                      {material.category}
                    </span>
                  </div>

                  <h2 className="mt-4 text-base font-semibold leading-snug text-foreground">
                    {material.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {material.description}
                  </p>

                  <ul className="mt-3 space-y-1.5">
                    {material.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-xs leading-5 text-foreground"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f36f21]"
                          aria-hidden="true"
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/10 pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {material.readingTime}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                      Открыть
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <section className="mt-8 rounded-xl border border-black/10 bg-[#171717] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#f36f21]">
                <Library className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                  Следующий шаг
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  Библиотека промптов
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/70">
                  Готовые формулировки для писем, документов, таблиц,
                  презентаций, HR, продаж и рабочих процессов. Тоже доступна без
                  прохождения уроков.
                </p>
              </div>
            </div>
            <Link
              href={promptLibraryHref}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f36f21] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#d95c16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
            >
              Перейти в библиотеку
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
