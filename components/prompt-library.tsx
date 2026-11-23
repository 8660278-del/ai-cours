"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  SearchX,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LibraryPrompt, PromptCategory } from "@/lib/prompt-library";
import type { PersonalPrompt } from "@/lib/models";
import { createLibraryPromptSchema } from "@/lib/validation/library-prompts";

interface PromptLibraryProps {
  prompts: LibraryPrompt[];
  categories: PromptCategory[];
}

interface PromptFormState {
  title: string;
  category: string;
  promptText: string;
  purpose: string;
  situation: string;
  variables: string;
  exampleOutput: string;
  checks: string;
}

type PromptFormErrors = Partial<Record<keyof PromptFormState, string>>;

function createEmptyForm(categoryId: string): PromptFormState {
  return {
    title: "",
    category: categoryId,
    promptText: "",
    purpose: "",
    situation: "",
    variables: "",
    exampleOutput: "",
    checks: "",
  };
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/ё/g, "е");
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toPersonalPromptCard(
  prompt: PersonalPrompt,
  categories: PromptCategory[]
): LibraryPrompt {
  const matched = categories.find(
    (category) =>
      category.id === prompt.category ||
      category.title.toLowerCase() === prompt.category.toLowerCase()
  );

  return {
    id: prompt.id,
    categoryId: matched?.id ?? categories[0]?.id ?? "",
    title: prompt.title,
    purpose: prompt.purpose,
    situation: prompt.situation,
    promptText: prompt.promptText,
    variables: prompt.variables,
    exampleOutput: prompt.exampleOutput,
    checks: prompt.checks,
    source: "personal",
    personalId: prompt.id,
  };
}

export function PromptLibrary({ prompts, categories }: PromptLibraryProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState<string[]>([]);
  const [personalPrompts, setPersonalPrompts] = useState<LibraryPrompt[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<PromptFormState>(() =>
    createEmptyForm(categories[0]?.id ?? "")
  );
  const [formErrors, setFormErrors] = useState<PromptFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingLibrary(true);

      const [favoritesResult, personalResult] = await Promise.allSettled([
        fetch("/api/favorite-prompts", { cache: "no-store" }),
        fetch("/api/personal-prompts", { cache: "no-store" }),
      ]);

      let favoritesFailed = false;
      let personalFailed = false;

      if (favoritesResult.status === "fulfilled" && favoritesResult.value.ok) {
        const data = (await favoritesResult.value.json().catch(() => null)) as {
          promptIds?: string[];
        } | null;

        if (!cancelled) {
          setFavoriteIds(data?.promptIds ?? []);
        }
      } else {
        favoritesFailed = true;
      }

      if (personalResult.status === "fulfilled" && personalResult.value.ok) {
        const data = (await personalResult.value.json().catch(() => null)) as {
          prompts?: PersonalPrompt[];
        } | null;

        if (!cancelled) {
          setPersonalPrompts(
            (data?.prompts ?? []).map((prompt) =>
              toPersonalPromptCard(prompt, categories)
            )
          );
        }
      } else {
        personalFailed = true;
      }

      if (cancelled) {
        return;
      }

      if (favoritesFailed && personalFailed) {
        setLoadError(
          "Не удалось загрузить избранное и личные промпты. Готовые промпты доступны ниже."
        );
      } else if (favoritesFailed) {
        setLoadError(
          "Не удалось загрузить избранное. Отметки могут быть неполными до следующей загрузки."
        );
      } else if (personalFailed) {
        setLoadError(
          "Не удалось загрузить личные промпты. Готовые промпты доступны ниже."
        );
      } else {
        setLoadError(null);
      }

      setLoadingLibrary(false);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [categories, reloadKey]);

  const allPrompts = useMemo(
    () => [...personalPrompts, ...prompts],
    [personalPrompts, prompts]
  );

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const countsByCategory = useMemo(() => {
    const counts = new Map<string, number>();

    allPrompts.forEach((prompt) => {
      counts.set(prompt.categoryId, (counts.get(prompt.categoryId) ?? 0) + 1);
    });

    return counts;
  }, [allPrompts]);

  const normalizedQuery = normalize(query.trim());
  const hasActiveFilter =
    normalizedQuery.length > 0 || activeCategory !== "all" || favoritesOnly;

  const visiblePrompts = useMemo(() => {
    return allPrompts.filter((prompt) => {
      if (favoritesOnly && !favoriteIds.includes(prompt.id)) {
        return false;
      }

      if (activeCategory !== "all" && prompt.categoryId !== activeCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const categoryTitle =
        categoryById.get(prompt.categoryId)?.title ?? prompt.categoryId;
      const haystack = normalize(
        [
          prompt.title,
          prompt.purpose,
          prompt.situation ?? "",
          prompt.promptText,
          prompt.exampleOutput ?? "",
          categoryTitle,
          ...(prompt.variables ?? []),
          ...(prompt.checks ?? []),
        ].join(" ")
      );

      return haystack.includes(normalizedQuery);
    });
  }, [
    allPrompts,
    activeCategory,
    categoryById,
    favoriteIds,
    favoritesOnly,
    normalizedQuery,
  ]);

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setFavoritesOnly(false);
  };

  const openForm = () => {
    setForm(createEmptyForm(categories[0]?.id ?? ""));
    setFormErrors({});
    setFormOpen(true);
  };

  const handleCopy = async (prompt: LibraryPrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopiedId(prompt.id);
      toast.success("Промпт скопирован", {
        description: "Полный текст промпта в буфере обмена.",
      });
      window.setTimeout(
        () =>
          setCopiedId((current) => (current === prompt.id ? null : current)),
        2000
      );
    } catch {
      toast.error("Не удалось скопировать", {
        description: "Выделите текст промпта и скопируйте его вручную.",
      });
    }
  };

  const handleToggleFavorite = async (prompt: LibraryPrompt) => {
    if (pendingFavoriteIds.includes(prompt.id)) {
      return;
    }

    const wasFavorite = favoriteIds.includes(prompt.id);
    setPendingFavoriteIds((prev) => [...prev, prompt.id]);
    setFavoriteIds((prev) =>
      wasFavorite ? prev.filter((id) => id !== prompt.id) : [...prev, prompt.id]
    );

    try {
      const response = wasFavorite
        ? await fetch(
            `/api/favorite-prompts?promptId=${encodeURIComponent(prompt.id)}`,
            { method: "DELETE" }
          )
        : await fetch("/api/favorite-prompts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ promptId: prompt.id }),
          });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(
          data?.error ?? "Не удалось обновить избранное. Попробуйте ещё раз."
        );
      }

      toast.success(
        wasFavorite
          ? "Промпт удалён из избранного"
          : "Промпт добавлен в избранное",
        {
          description: wasFavorite
            ? "Он больше не показывается в фильтре избранного."
            : "Он останется в избранном после перезагрузки страницы.",
        }
      );
    } catch (error) {
      setFavoriteIds((prev) =>
        wasFavorite
          ? [...prev, prompt.id]
          : prev.filter((id) => id !== prompt.id)
      );
      toast.error("Не удалось обновить избранное", {
        description:
          error instanceof Error ? error.message : "Попробуйте ещё раз.",
      });
    } finally {
      setPendingFavoriteIds((prev) => prev.filter((id) => id !== prompt.id));
    }
  };

  const deletePersonalPrompt = async (prompt: LibraryPrompt) => {
    if (!prompt.personalId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/personal-prompts?id=${encodeURIComponent(prompt.personalId)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(data?.error ?? "Не удалось удалить промпт.");
      }

      setPersonalPrompts((prev) =>
        prev.filter((item) => item.id !== prompt.id)
      );
      setFavoriteIds((prev) => prev.filter((id) => id !== prompt.id));
      toast.success("Личный промпт удалён");
    } catch (error) {
      toast.error("Не удалось удалить промпт", {
        description:
          error instanceof Error ? error.message : "Попробуйте ещё раз.",
      });
    }
  };

  const handleDeletePersonalPrompt = (prompt: LibraryPrompt) => {
    if (!prompt.personalId) {
      return;
    }

    toast("Удалить личный промпт?", {
      description: prompt.title,
      action: {
        label: "Удалить",
        onClick: () => {
          void deletePersonalPrompt(prompt);
        },
      },
      cancel: {
        label: "Отмена",
        onClick: () => {},
      },
    });
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = createLibraryPromptSchema.safeParse({
      title: form.title,
      category: form.category,
      promptText: form.promptText,
      purpose: form.purpose.trim() || undefined,
      situation: form.situation.trim() || undefined,
      variables: splitLines(form.variables),
      exampleOutput: form.exampleOutput.trim() || undefined,
      checks: splitLines(form.checks),
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setFormErrors({
        title: fieldErrors.title?.[0],
        category: fieldErrors.category?.[0],
        promptText: fieldErrors.promptText?.[0],
        variables: fieldErrors.variables?.[0],
        checks: fieldErrors.checks?.[0],
      });
      toast.error("Проверьте поля формы", {
        description: "Название, категория и текст промпта обязательны.",
      });
      return;
    }

    setSubmitting(true);
    setFormErrors({});

    try {
      const response = await fetch("/api/library-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(
          data?.error ?? "Не удалось сохранить промпт. Попробуйте ещё раз."
        );
      }

      const data = (await response.json()) as { prompt: PersonalPrompt };
      setPersonalPrompts((prev) => [
        toPersonalPromptCard(data.prompt, categories),
        ...prev,
      ]);
      setForm(createEmptyForm(categories[0]?.id ?? ""));
      setFormOpen(false);
      setActiveCategory("all");
      setFavoritesOnly(false);
      setQuery("");
      toast.success("Личный промпт сохранён", {
        description:
          "Он появился в библиотеке и останется там после перезагрузки.",
      });
    } catch (error) {
      toast.error("Не удалось сохранить промпт", {
        description:
          error instanceof Error ? error.message : "Попробуйте ещё раз.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по названию, задаче или тексту промпта"
              aria-label="Поиск промптов"
              className="h-11 border-black/15 bg-white pl-9"
            />
          </div>

          <label className="block xl:w-72">
            <span className="sr-only">Категория промптов</span>
            <select
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
              className="h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
            >
              <option value="all">Все категории ({allPrompts.length})</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title} ({countsByCategory.get(category.id) ?? 0})
                </option>
              ))}
            </select>
          </label>

          <Button
            type="button"
            variant={favoritesOnly ? "default" : "outline"}
            onClick={() => setFavoritesOnly((value) => !value)}
            aria-pressed={favoritesOnly}
            className={cn(
              "h-11 justify-center",
              favoritesOnly
                ? "bg-[#f36f21] text-white hover:bg-[#d95c16]"
                : "border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
            )}
          >
            <Star
              className={cn(
                "h-4 w-4",
                favoritesOnly && "fill-white text-white"
              )}
            />
            Избранное ({favoriteIds.length})
          </Button>

          <Button
            type="button"
            onClick={() => (formOpen ? setFormOpen(false) : openForm())}
            className="h-11 justify-center bg-[#171717] text-white hover:bg-black"
          >
            {formOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {formOpen ? "Закрыть форму" : "Добавить промпт"}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span>
            Показано {visiblePrompts.length} из {allPrompts.length} промптов
          </span>
          <span className="hidden h-3 w-px bg-black/10 sm:block" />
          <span>12 категорий · готовые и личные промпты</span>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Сбросить фильтры
            </button>
          )}
        </div>
      </section>

      {loadError && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-amber-900">{loadError}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setReloadKey((value) => value + 1)}
            className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
          >
            <RotateCcw className="h-4 w-4" />
            Повторить
          </Button>
        </div>
      )}

      {formOpen && (
        <section className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Новый личный промпт
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Название, категория и текст обязательны. Остальные поля помогают
                коллегам понять, как применять промпт.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Закрыть форму"
              onClick={() => setFormOpen(false)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={submitForm} className="mt-5 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Название <span className="text-[#f36f21]">*</span>
                </span>
                <Input
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Например, ответ на запрос о сроках поставки"
                  className="mt-1.5 h-11 border-black/15 bg-white"
                  aria-invalid={Boolean(formErrors.title)}
                />
                {formErrors.title && (
                  <span className="mt-1 block text-xs text-destructive">
                    {formErrors.title}
                  </span>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Категория <span className="text-[#f36f21]">*</span>
                </span>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  className="mt-1.5 h-11 w-full rounded-md border border-black/15 bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                  aria-invalid={Boolean(formErrors.category)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <span className="mt-1 block text-xs text-destructive">
                    {formErrors.category}
                  </span>
                )}
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-foreground">
                Полный текст промпта <span className="text-[#f36f21]">*</span>
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                Используйте переменные в формате {"{{переменная}}"}, чтобы
                заменять данные при повторном использовании.
              </span>
              <textarea
                value={form.promptText}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    promptText: event.target.value,
                  }))
                }
                rows={6}
                placeholder="Ты — помощник... Подготовь... Контекст: {{данные}}..."
                className="mt-1.5 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                aria-invalid={Boolean(formErrors.promptText)}
              />
              {formErrors.promptText && (
                <span className="mt-1 block text-xs text-destructive">
                  {formErrors.promptText}
                </span>
              )}
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Назначение
                </span>
                <textarea
                  value={form.purpose}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      purpose: event.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Что помогает сделать промпт"
                  className="mt-1.5 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Ситуация использования
                </span>
                <textarea
                  value={form.situation}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      situation: event.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Когда и зачем применять промпт"
                  className="mt-1.5 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Переменные
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                  По одной переменной в строке.
                </span>
                <textarea
                  value={form.variables}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      variables: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder={
                    "{{компания}} — название компании\n{{срок}} — дата ответа"
                  }
                  className="mt-1.5 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Рекомендации по проверке
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                  По одной рекомендации в строке.
                </span>
                <textarea
                  value={form.checks}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      checks: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder={
                    "Сверьте цифры с исходными данными\nПроверьте тон письма"
                  }
                  className="mt-1.5 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-foreground">
                Пример результата
              </span>
              <textarea
                value={form.exampleOutput}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    exampleOutput: event.target.value,
                  }))
                }
                rows={3}
                placeholder="Необязательный пример того, что должен вернуть ИИ"
                className="mt-1.5 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 border-t border-black/10 pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#f36f21] text-white hover:bg-[#d95c16]"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {submitting ? "Сохраняем..." : "Сохранить промпт"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                className="border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
              >
                Отмена
              </Button>
              <span className="text-xs text-muted-foreground">
                Личный промпт появится в библиотеке наравне с готовыми.
              </span>
            </div>
          </form>
        </section>
      )}

      {loadingLibrary && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((index) => (
            <Skeleton key={index} className="h-44 rounded-xl" />
          ))}
        </div>
      )}

      {visiblePrompts.length === 0 ? (
        <section className="rounded-xl border border-black/10 bg-white px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f1ec] text-muted-foreground">
            <SearchX className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
            Подходящих промптов нет
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {favoritesOnly
              ? "В избранном пока нет промптов с такими условиями. Добавьте промпт в избранное или измените фильтр."
              : "Измените поисковый запрос или выберите другую категорию — в библиотеке есть готовые промпты для рабочих задач."}
          </p>
          {hasActiveFilter && (
            <Button
              type="button"
              onClick={resetFilters}
              className="mt-5 bg-[#f36f21] text-white hover:bg-[#d95c16]"
            >
              <RotateCcw className="h-4 w-4" />
              Сбросить фильтры
            </Button>
          )}
        </section>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
          {visiblePrompts.map((prompt) => {
            const isFavorite = favoriteIds.includes(prompt.id);
            const isPendingFavorite = pendingFavoriteIds.includes(prompt.id);
            const isCopied = copiedId === prompt.id;
            const categoryTitle =
              categoryById.get(prompt.categoryId)?.title ?? "Без категории";

            return (
              <article
                key={prompt.id}
                className="flex flex-col rounded-xl border border-black/10 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-[#f3f1ec] text-foreground"
                      >
                        {categoryTitle}
                      </Badge>
                      {prompt.source === "personal" && (
                        <Badge variant="outline" className="border-black/15">
                          <UserRound className="h-3 w-3" />
                          Личный
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground">
                      {prompt.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Назначение:{" "}
                      </span>
                      {prompt.purpose}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      void handleToggleFavorite(prompt);
                    }}
                    disabled={isPendingFavorite}
                    aria-pressed={isFavorite}
                    aria-label={
                      isFavorite
                        ? "Убрать промпт из избранного"
                        : "Добавить промпт в избранное"
                    }
                    className={cn(
                      "shrink-0",
                      isFavorite
                        ? "text-[#f36f21] hover:bg-[#fdf1e8]"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isPendingFavorite ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Star
                        className={cn(
                          "h-5 w-5",
                          isFavorite && "fill-[#f36f21]"
                        )}
                      />
                    )}
                  </Button>
                </div>

                {prompt.situation && (
                  <div className="mt-3 rounded-lg border border-black/10 bg-[#fbfaf7] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Ситуация использования
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground">
                      {prompt.situation}
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Полный текст промпта
                  </p>
                  <pre className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-[#171717] p-4 font-sans text-sm leading-6 text-white/90">
                    {prompt.promptText}
                  </pre>
                </div>

                {prompt.variables && prompt.variables.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Переменные для заполнения
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {prompt.variables.map((variable, index) => (
                        <li key={`${prompt.id}-variable-${index}`}>
                          <code className="inline-block rounded-md border border-black/10 bg-[#f3f1ec] px-2 py-1 text-xs leading-5 text-foreground">
                            {variable}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {prompt.exampleOutput && (
                  <div className="mt-4 rounded-lg border border-black/10 bg-[#fbfaf7] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Пример результата
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-foreground">
                      {prompt.exampleOutput}
                    </p>
                  </div>
                )}

                {prompt.checks && prompt.checks.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Рекомендации по проверке
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {prompt.checks.map((check, index) => (
                        <li
                          key={`${prompt.id}-check-${index}`}
                          className="flex items-start gap-2 text-sm leading-6 text-foreground"
                        >
                          <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-[#f36f21]" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      void handleCopy(prompt);
                    }}
                    className="bg-[#f36f21] text-white hover:bg-[#d95c16]"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {isCopied ? "Скопировано" : "Скопировать промпт"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      void handleToggleFavorite(prompt);
                    }}
                    disabled={isPendingFavorite}
                    className="border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        isFavorite && "fill-[#f36f21] text-[#f36f21]"
                      )}
                    />
                    {isFavorite ? "В избранном" : "В избранное"}
                  </Button>
                  {prompt.source === "personal" && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDeletePersonalPrompt(prompt)}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Удалить
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section className="rounded-xl border border-dashed border-black/15 bg-white/60 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f1ec] text-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Как пользоваться библиотекой
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              Замените переменные в фигурных скобках на свои данные и скопируйте
              полный текст промпта. Перед использованием проверьте ответ ИИ по
              рекомендациям в карточке: факты, цифры и итоговые формулировки
              остаются зоной ответственности сотрудника.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
