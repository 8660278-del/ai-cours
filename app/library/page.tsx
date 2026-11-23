import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Library, ListFilter, Star } from "lucide-react";
import { PromptLibrary } from "@/components/prompt-library";
import { libraryPrompts, promptCategories } from "@/lib/prompt-library";

export const metadata: Metadata = {
  title: "Библиотека промптов — ГК ПИР",
  description:
    "Готовые промпты для деловой переписки, документов, анализа, таблиц, презентаций, HR, продаж, маркетинга и рабочих процессов.",
};

export default function LibraryPage() {
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
              Библиотека промптов
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              Готовые промпты для ежедневной работы
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Двенадцать категорий с проверенными формулировками для писем,
              документов, анализа, таблиц, презентаций, HR, продаж, маркетинга и
              процессов. Раздел доступен в любой момент независимо от прогресса
              модулей.
            </p>
          </div>

          <aside className="rounded-xl border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                В библиотеке
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3f1ec] text-foreground">
                <Library className="h-4 w-4" />
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-black/10 bg-[#fbfaf7] p-3">
                <dt className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Категории
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground">
                  {promptCategories.length}
                </dd>
              </div>
              <div className="rounded-lg border border-black/10 bg-[#fbfaf7] p-3">
                <dt className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Промпты
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-foreground">
                  {libraryPrompts.length}
                </dd>
              </div>
            </dl>
            <ul className="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-foreground" />
                Поиск и фильтр по категориям
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#f36f21]" />
                Избранное сохраняется после перезагрузки
              </li>
              <li className="flex items-center gap-2">
                <Library className="h-4 w-4 text-foreground" />
                Личные промпты рядом с готовыми
              </li>
            </ul>
          </aside>
        </div>

        <div className="mt-8 sm:mt-10">
          <PromptLibrary
            prompts={libraryPrompts}
            categories={promptCategories}
          />
        </div>
      </div>
    </div>
  );
}
