"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ListChecks,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ideaPractice,
  imagePromptPractice,
  presentationPractice,
  presentationReviewPractice,
  visualizationPractice,
  type IdeaComplexity,
  type IdeaEffect,
  type IdeaRisk,
  type ImagePromptOption,
  type VisualizationType,
} from "@/lib/module4-interactive-data";

function ResetButton({
  onClick,
  label = "Сбросить",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-9 border-black/15 bg-white text-foreground hover:bg-[#f3f1ec]"
    >
      <RotateCcw className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

function ReferenceButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="h-9 border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
    >
      <Lightbulb className="h-4 w-4 text-emerald-600" />
      {open ? "Скрыть эталон" : "Показать эталон"}
    </Button>
  );
}

function ProgressLine({
  answered,
  total,
  extra,
}: {
  answered: number;
  total: number;
  extra?: string;
}) {
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);

  return (
    <div className="rounded-lg border border-black/10 bg-[#f9f8f5] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Заполнено {answered} из {total}
        </span>
        {extra && <span>{extra}</span>}
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e8e5df]">
        <div
          className="h-full rounded-full bg-[#f36f21] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

const effectLabels: Record<IdeaEffect, string> = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const complexityLabels: Record<IdeaComplexity, string> = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
};

const riskLabels: Record<IdeaRisk, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

const effectValues: IdeaEffect[] = ["high", "medium", "low"];
const complexityValues: IdeaComplexity[] = ["low", "medium", "high"];
const riskValues: IdeaRisk[] = ["low", "medium", "high"];

function IdeaChoiceRow<T extends string>({
  label,
  values,
  labels,
  selected,
  onSelect,
}: {
  label: string;
  values: T[];
  labels: Record<T, string>;
  selected?: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {values.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            selected === value
              ? "border-[#f36f21] bg-[#fff7f1] text-[#c8560f]"
              : "border-black/15 bg-white text-foreground hover:border-black/30"
          )}
        >
          {labels[value]}
        </button>
      ))}
    </div>
  );
}

export function IdeaPractice() {
  const [effects, setEffects] = useState<Partial<Record<string, IdeaEffect>>>(
    {}
  );
  const [complexities, setComplexities] = useState<
    Partial<Record<string, IdeaComplexity>>
  >({});
  const [risks, setRisks] = useState<Partial<Record<string, IdeaRisk>>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const evaluated = ideaPractice.options.filter(
    (option) =>
      effects[option.id] && complexities[option.id] && risks[option.id]
  ).length;

  const recommendedIds = ideaPractice.options
    .filter((option) => option.recommended)
    .map((option) => option.id);

  const matched = selected.filter((id) => recommendedIds.includes(id)).length;

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const reset = () => {
    setEffects({});
    setComplexities({});
    setRisks({});
    setSelected([]);
    setChecked(false);
  };

  const ready =
    evaluated === ideaPractice.options.length && selected.length === 3;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Target className="h-4 w-4 text-[#f36f21]" />
          Рабочая проблема
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground">
          {ideaPractice.problemTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {ideaPractice.context}
        </p>
        <div className="mt-3 rounded-lg border border-black/10 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Ограничения
          </p>
          <ul className="mt-2 space-y-1.5">
            {ideaPractice.constraints.map((constraint) => (
              <li
                key={constraint}
                className="flex gap-2 text-xs leading-5 text-foreground/80"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#f36f21]" />
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Оцените каждый вариант по эффекту, сложности и риску, затем выберите
          ровно три перспективных решения.
        </p>
        {(evaluated > 0 || selected.length > 0) && (
          <ResetButton onClick={reset} />
        )}
      </div>

      <ProgressLine
        answered={evaluated}
        total={ideaPractice.options.length}
        extra={`Выбрано: ${selected.length} из 3`}
      />

      <div className="space-y-3">
        {ideaPractice.options.map((option, index) => {
          const isSelected = selected.includes(option.id);
          const selectionBlocked = !isSelected && selected.length >= 3;

          return (
            <div
              key={option.id}
              className={cn(
                "rounded-xl border bg-white p-4 transition-colors sm:p-5",
                isSelected
                  ? "border-[#f36f21]/50 ring-1 ring-[#f36f21]/20"
                  : "border-black/10"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Вариант {index + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {option.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSelected(option.id)}
                  disabled={selectionBlocked}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-[#f36f21] bg-[#fff7f1] text-[#c8560f]"
                      : selectionBlocked
                        ? "cursor-not-allowed border-black/10 bg-[#f3f1ec] text-muted-foreground"
                        : "border-black/15 bg-white text-foreground hover:border-black/30"
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isSelected ? "В шорт-листе" : "В перспективные"}
                </button>
              </div>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {option.description}
              </p>

              <div className="mt-3 space-y-2">
                <IdeaChoiceRow
                  label="Эффект"
                  values={effectValues}
                  labels={effectLabels}
                  selected={effects[option.id]}
                  onSelect={(value) =>
                    setEffects((prev) => ({ ...prev, [option.id]: value }))
                  }
                />
                <IdeaChoiceRow
                  label="Сложность"
                  values={complexityValues}
                  labels={complexityLabels}
                  selected={complexities[option.id]}
                  onSelect={(value) =>
                    setComplexities((prev) => ({ ...prev, [option.id]: value }))
                  }
                />
                <IdeaChoiceRow
                  label="Риск"
                  values={riskValues}
                  labels={riskLabels}
                  selected={risks[option.id]}
                  onSelect={(value) =>
                    setRisks((prev) => ({ ...prev, [option.id]: value }))
                  }
                />
              </div>

              {checked && (
                <div className="mt-3 rounded-lg border border-black/10 bg-[#f9f8f5] p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Эталонная оценка
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-foreground/85">
                    Эффект — {effectLabels[option.effect]}, сложность —{" "}
                    {complexityLabels[option.complexity]}, риск —{" "}
                    {riskLabels[option.risk]}. {option.rationale}
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    Риск: {option.riskNote}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!ready}
          className="bg-[#f36f21] text-white hover:bg-[#d95c16] disabled:opacity-50"
        >
          <ListChecks className="h-4 w-4" />
          Проверить оценки
        </Button>
        {!ready && (
          <span className="text-xs leading-5 text-muted-foreground">
            Оцените все 10 вариантов и выберите ровно три.
          </span>
        )}
      </div>

      {checked && (
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            {ideaPractice.recommendationTitle}: совпало {matched} из 3
          </p>
          <ul className="space-y-2">
            {ideaPractice.recommendation.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-emerald-200 bg-white p-3 text-sm leading-6 text-foreground/85"
              >
                {item}
              </li>
            ))}
          </ul>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Следующие шаги
            </p>
            <ul className="mt-2 space-y-1.5">
              {ideaPractice.nextSteps.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-emerald-800"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

interface SlideDraft {
  id: string;
  title: string;
  mainIdea: string;
  arguments: string;
  data: string;
  visualization: string;
}

function createEmptySlide(id: string): SlideDraft {
  return {
    id,
    title: "",
    mainIdea: "",
    arguments: "",
    data: "",
    visualization: "",
  };
}

function createInitialSlides(): SlideDraft[] {
  return Array.from({ length: 6 }, (_, index) =>
    createEmptySlide(`slide-draft-${index + 1}`)
  );
}

const slideFields: {
  key: keyof Omit<SlideDraft, "id">;
  label: string;
  hint: string;
  rows: number;
}[] = [
  {
    key: "title",
    label: "Заголовок-вывод",
    hint: "Одно предложение, которое передаёт мысль слайда.",
    rows: 2,
  },
  {
    key: "mainIdea",
    label: "Основная мысль",
    hint: "Что должен понять зритель после этого слайда.",
    rows: 2,
  },
  {
    key: "arguments",
    label: "Аргументы",
    hint: "2–3 довода, каждый с новой строки.",
    rows: 3,
  },
  {
    key: "data",
    label: "Нужные данные",
    hint: "Цифры, факты, показатели и источник.",
    rows: 2,
  },
  {
    key: "visualization",
    label: "Способ визуализации",
    hint: "Диаграмма, график, таблица, схема или блок-схема.",
    rows: 2,
  },
];

function isSlideFilled(slide: SlideDraft): boolean {
  return slideFields.every((field) => slide[field.key].trim().length > 0);
}

export function PresentationPractice() {
  const [slides, setSlides] = useState<SlideDraft[]>(createInitialSlides);
  const [checked, setChecked] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const filledSlides = slides.filter(isSlideFilled).length;
  const ready =
    slides.length >= presentationPractice.minSlides &&
    slides.length <= presentationPractice.maxSlides &&
    filledSlides === slides.length;

  const updateSlide = (
    id: string,
    key: keyof Omit<SlideDraft, "id">,
    value: string
  ) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === id ? { ...slide, [key]: value } : slide
      )
    );
  };

  const addSlide = () => {
    if (slides.length >= presentationPractice.maxSlides) {
      return;
    }
    setSlides((prev) => [
      ...prev,
      createEmptySlide(`slide-added-${prev.length + 1}-${Date.now()}`),
    ]);
  };

  const removeSlide = (id: string) => {
    if (slides.length <= presentationPractice.minSlides) {
      return;
    }
    setSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  const reset = () => {
    setSlides(createInitialSlides());
    setChecked(false);
    setReferenceOpen(false);
  };

  return (
    <div className="space-y-4">
      <details className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <summary className="cursor-pointer text-sm font-semibold text-foreground">
          Исходный документ: {presentationPractice.documentTitle}
        </summary>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {presentationPractice.documentMeta}
        </p>
        <div className="mt-3 max-h-72 space-y-3 overflow-y-auto rounded-lg border border-black/10 bg-white p-4">
          {presentationPractice.sections.map((section) => (
            <div key={section.id}>
              <p className="text-sm font-semibold text-foreground">
                {section.title}
              </p>
              <div className="mt-1 space-y-1.5">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-6 text-foreground/80"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[#f36f21]/25 bg-[#fff7f1] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#c8560f]">
            Аудитория и цель
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/85">
            {presentationPractice.audience}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/85">
            <span className="font-medium text-foreground">Цель:</span>{" "}
            {presentationPractice.goal}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Что нужно сделать
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/85">
            {presentationPractice.request}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Слайдов: {slides.length} (допустимо {presentationPractice.minSlides}–
          {presentationPractice.maxSlides}). Заполнено полностью: {filledSlides}
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSlide}
            disabled={slides.length >= presentationPractice.maxSlides}
            className="h-9 border-black/15 bg-white text-foreground hover:bg-[#f3f1ec]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить слайд
          </Button>
          <ResetButton onClick={reset} />
        </div>
      </div>

      <ProgressLine
        answered={filledSlides}
        total={slides.length}
        extra={`${presentationPractice.minSlides}–${presentationPractice.maxSlides} слайдов`}
      />

      <div className="space-y-3">
        {slides.map((slide, index) => {
          const filled = isSlideFilled(slide);

          return (
            <div
              key={slide.id}
              className={cn(
                "rounded-xl border bg-white p-4 sm:p-5",
                checked && filled ? "border-emerald-200" : "border-black/10"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Слайд {index + 1}
                </p>
                <div className="flex items-center gap-2">
                  {checked &&
                    (filled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        заполнен
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        не заполнен
                      </span>
                    ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSlide(slide.id)}
                    disabled={slides.length <= presentationPractice.minSlides}
                    className="h-8 border-black/15 bg-white px-2 text-muted-foreground hover:bg-[#f9f8f5]"
                    aria-label={`Удалить слайд ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {slideFields.map((field) => (
                  <label
                    key={field.key}
                    className={cn(
                      "block",
                      field.key === "arguments" && "sm:col-span-2"
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {field.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                      {field.hint}
                    </span>
                    <textarea
                      value={slide[field.key]}
                      onChange={(event) =>
                        updateSlide(slide.id, field.key, event.target.value)
                      }
                      rows={field.rows}
                      className="mt-1.5 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                    />
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!ready}
          className="bg-[#f36f21] text-white hover:bg-[#d95c16] disabled:opacity-50"
        >
          <ListChecks className="h-4 w-4" />
          Проверить структуру
        </Button>
        <ReferenceButton
          open={referenceOpen}
          onToggle={() => setReferenceOpen((prev) => !prev)}
        />
        {!ready && (
          <span className="text-xs leading-5 text-muted-foreground">
            Заполните все поля на каждом слайде, оставьте от{" "}
            {presentationPractice.minSlides} до {presentationPractice.maxSlides}{" "}
            слайдов.
          </span>
        )}
      </div>

      {checked && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Структура собрана: {slides.length} слайдов, все поля заполнены
          </p>
          <ul className="mt-3 space-y-1.5">
            {presentationPractice.checklist.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-6 text-emerald-800"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {referenceOpen && (
        <div className="space-y-3 rounded-xl border border-black/10 bg-[#f9f8f5] p-4">
          <p className="text-sm font-semibold text-foreground">
            Эталонная структура презентации
          </p>
          {presentationPractice.referenceSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="rounded-lg border border-black/10 bg-white p-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Слайд {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {slide.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-foreground/80">
                {slide.mainIdea}
              </p>
              <ul className="mt-2 space-y-1">
                {slide.arguments.map((argument) => (
                  <li
                    key={argument}
                    className="flex gap-2 text-xs leading-5 text-foreground/75"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#f36f21]" />
                    {argument}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                <span className="font-medium text-foreground">Данные:</span>{" "}
                {slide.data}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                <span className="font-medium text-foreground">
                  Визуализация:
                </span>{" "}
                {slide.visualization}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const visualizationLabels: Record<VisualizationType, string> = {
  bar: "Столбчатая диаграмма",
  line: "Линейный график",
  table: "Таблица",
  scheme: "Схема",
  flowchart: "Блок-схема",
  matrix: "Матрица",
  responsibility: "Таблица ответственности",
};

export function VisualizationPractice() {
  const [choices, setChoices] = useState<
    Partial<Record<string, VisualizationType>>
  >({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const answered = visualizationPractice.datasets.filter(
    (dataset) => choices[dataset.id] !== undefined
  ).length;
  const explained = visualizationPractice.datasets.filter(
    (dataset) => (explanations[dataset.id] ?? "").trim().length > 0
  ).length;
  const ready =
    answered === visualizationPractice.datasets.length &&
    explained === visualizationPractice.datasets.length;

  const correct = visualizationPractice.datasets.filter(
    (dataset) => choices[dataset.id] === dataset.correct
  ).length;

  const reset = () => {
    setChoices({});
    setExplanations({});
    setChecked(false);
    setReferenceOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[#f36f21]" />
          Виды визуализации
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {visualizationPractice.types.map((type) => (
            <div
              key={type.id}
              className="rounded-lg border border-black/10 bg-white p-2.5"
            >
              <p className="text-xs font-semibold text-foreground">
                {type.label}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                {type.hint}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Для каждого набора данных выберите вид визуализации и объясните выбор.
        </p>
        {(answered > 0 || explained > 0) && <ResetButton onClick={reset} />}
      </div>

      <ProgressLine
        answered={answered}
        total={visualizationPractice.datasets.length}
        extra={`Объяснений: ${explained}`}
      />

      <div className="space-y-3">
        {visualizationPractice.datasets.map((dataset, index) => {
          const choice = choices[dataset.id];
          const isCorrect = checked && choice === dataset.correct;

          return (
            <div
              key={dataset.id}
              className={cn(
                "rounded-xl border bg-white p-4 sm:p-5",
                checked
                  ? isCorrect
                    ? "border-emerald-200"
                    : "border-red-200"
                  : "border-black/10"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Набор {index + 1}
                </p>
                {checked && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      isCorrect ? "text-emerald-700" : "text-red-700"
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {isCorrect
                      ? "Верно"
                      : `Эталон: ${visualizationLabels[dataset.correct]}`}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {dataset.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {dataset.description}
              </p>
              <ul className="mt-2 space-y-1.5 rounded-lg border border-black/10 bg-[#f9f8f5] p-3">
                {dataset.data.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-xs leading-5 text-foreground/80"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#f36f21]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap gap-2">
                {visualizationPractice.types.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setChoices((prev) => ({
                        ...prev,
                        [dataset.id]: type.id,
                      }))
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      choice === type.id
                        ? "border-[#f36f21] bg-[#fff7f1] text-[#c8560f]"
                        : "border-black/15 bg-white text-foreground hover:border-black/30"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <label className="mt-3 block">
                <span className="text-sm font-semibold text-foreground">
                  Обоснование выбора и риск искажения
                </span>
                <textarea
                  value={explanations[dataset.id] ?? ""}
                  onChange={(event) =>
                    setExplanations((prev) => ({
                      ...prev,
                      [dataset.id]: event.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Почему этот вид подходит к вопросу и типу данных? Какого искажения нужно избежать?"
                  className="mt-1.5 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                />
              </label>

              {checked && (
                <div className="mt-3 space-y-2 rounded-lg border border-black/10 bg-[#f9f8f5] p-3">
                  <p className="text-sm leading-6 text-foreground/85">
                    {dataset.explanation}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Типичная ошибка:
                    </span>{" "}
                    {dataset.mistake}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!ready}
          className="bg-[#f36f21] text-white hover:bg-[#d95c16] disabled:opacity-50"
        >
          <ListChecks className="h-4 w-4" />
          Проверить выбор
        </Button>
        <ReferenceButton
          open={referenceOpen}
          onToggle={() => setReferenceOpen((prev) => !prev)}
        />
        {!ready && (
          <span className="text-xs leading-5 text-muted-foreground">
            Выберите вид и напишите обоснование для всех наборов.
          </span>
        )}
      </div>

      {checked && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Верных выборов: {correct} из {visualizationPractice.datasets.length}
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            Сверьте обоснования с эталоном. Если выбор отличается, объясните,
            какой вопрос зрителя не закрывает выбранный вид.
          </p>
        </div>
      )}

      {referenceOpen && (
        <div className="rounded-xl border border-black/10 bg-[#f9f8f5] p-4">
          <p className="text-sm font-semibold text-foreground">
            Общие правила выбора и оформления
          </p>
          <ul className="mt-2 space-y-1.5">
            {visualizationPractice.generalRules.map((rule) => (
              <li
                key={rule}
                className="flex gap-2 text-sm leading-6 text-foreground/80"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f36f21]" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PromptOptionGroup({
  title,
  options,
  selected,
  onSelect,
  checked,
}: {
  title: string;
  options: ImagePromptOption[];
  selected?: string;
  onSelect: (id: string) => void;
  checked: boolean;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected === option.id;
          const status = checked
            ? option.suitable
              ? "border-emerald-300 bg-emerald-50"
              : "border-red-200 bg-red-50"
            : isSelected
              ? "border-[#f36f21] bg-[#fff7f1]"
              : "border-black/10 bg-white hover:border-black/25";

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={cn(
                "rounded-lg border p-3 text-left transition-colors",
                status
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-foreground">
                  {option.label}
                </p>
                {checked && (
                  <span
                    className={cn(
                      "shrink-0 text-[11px] font-medium",
                      option.suitable ? "text-emerald-700" : "text-red-700"
                    )}
                  >
                    {option.suitable ? "подходит" : "не подходит"}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {option.description}
              </p>
              {checked && (
                <p className="mt-1.5 text-xs leading-5 text-foreground/75">
                  {option.note}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ImagePromptPractice() {
  const [object, setObject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [composition, setComposition] = useState<string>();
  const [style, setStyle] = useState<string>();
  const [palette, setPalette] = useState<string>();
  const [format, setFormat] = useState<string>();
  const [constraints, setConstraints] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const selectedComposition = imagePromptPractice.compositionOptions.find(
    (option) => option.id === composition
  );
  const selectedStyle = imagePromptPractice.styleOptions.find(
    (option) => option.id === style
  );
  const selectedPalette = imagePromptPractice.paletteOptions.find(
    (option) => option.id === palette
  );
  const selectedFormat = imagePromptPractice.formatOptions.find(
    (option) => option.id === format
  );
  const selectedConstraints = imagePromptPractice.constraints.filter(
    (constraint) => constraints.includes(constraint.id)
  );

  const filledFields = [object, purpose].filter(
    (value) => value.trim().length > 0
  ).length;
  const filledChoices = [composition, style, palette, format].filter(
    Boolean
  ).length;
  const ready =
    filledFields === 2 && filledChoices === 4 && constraints.length >= 4;

  const choiceScore = [
    imagePromptPractice.compositionOptions.find(
      (option) => option.id === composition
    ),
    imagePromptPractice.styleOptions.find((option) => option.id === style),
    imagePromptPractice.paletteOptions.find((option) => option.id === palette),
    imagePromptPractice.formatOptions.find((option) => option.id === format),
  ].filter((option) => option?.suitable).length;

  const requiredConstraints = imagePromptPractice.constraints.filter(
    (constraint) => constraint.required
  );
  const requiredSelected = requiredConstraints.filter((constraint) =>
    constraints.includes(constraint.id)
  ).length;
  const optionalSelected = imagePromptPractice.constraints.filter(
    (constraint) => !constraint.required && constraints.includes(constraint.id)
  ).length;

  const toggleConstraint = (id: string) => {
    setConstraints((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setObject("");
    setPurpose("");
    setComposition(undefined);
    setStyle(undefined);
    setPalette(undefined);
    setFormat(undefined);
    setConstraints([]);
    setChecked(false);
    setReferenceOpen(false);
  };

  const assembledPrompt = [
    `Иллюстрация: ${object.trim() || "[объект не описан]"}.`,
    `Назначение: ${purpose.trim() || "[назначение не указано]"}.`,
    `Композиция: ${selectedComposition?.description ?? "[не выбрана]"}.`,
    `Стиль: ${selectedStyle?.description ?? "[не выбран]"}.`,
    `Цветовая гамма: ${selectedPalette?.description ?? "[не выбрана]"}.`,
    `Формат: ${selectedFormat?.description ?? "[не выбран]"}.`,
    `Ограничения: ${
      selectedConstraints.length > 0
        ? selectedConstraints.map((constraint) => constraint.label).join("; ")
        : "[не заданы]"
    }.`,
  ].join(" ");

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[#f36f21]" />
          {imagePromptPractice.contextTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {imagePromptPractice.context}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Аудитория
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground/80">
              {imagePromptPractice.audience}
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Мысль слайда
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground/80">
              {imagePromptPractice.slideMessage}
            </p>
          </div>
        </div>
        <ul className="mt-3 space-y-1.5 rounded-lg border border-black/10 bg-white p-3">
          {imagePromptPractice.taskRequirements.map((requirement) => (
            <li
              key={requirement}
              className="flex gap-2 text-xs leading-5 text-foreground/80"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#f36f21]" />
              {requirement}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Опишите объект и назначение, выберите композицию, стиль, палитру и
          формат, затем отметьте ограничения.
        </p>
        <ResetButton onClick={reset} />
      </div>

      <ProgressLine
        answered={filledFields + filledChoices}
        total={6}
        extra={`Ограничений: ${constraints.length}`}
      />

      <div className="space-y-3">
        {imagePromptPractice.fields.map((field) => (
          <label key={field.id} className="block">
            <span className="text-sm font-semibold text-foreground">
              {field.label}
            </span>
            <textarea
              value={field.id === "object" ? object : purpose}
              onChange={(event) =>
                field.id === "object"
                  ? setObject(event.target.value)
                  : setPurpose(event.target.value)
              }
              rows={2}
              placeholder={field.placeholder}
              className="mt-1.5 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
            />
            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              {field.hint}
            </span>
          </label>
        ))}
      </div>

      <PromptOptionGroup
        title="Композиция"
        options={imagePromptPractice.compositionOptions}
        selected={composition}
        onSelect={setComposition}
        checked={checked}
      />
      <PromptOptionGroup
        title="Стиль"
        options={imagePromptPractice.styleOptions}
        selected={style}
        onSelect={setStyle}
        checked={checked}
      />
      <PromptOptionGroup
        title="Цветовая гамма"
        options={imagePromptPractice.paletteOptions}
        selected={palette}
        onSelect={setPalette}
        checked={checked}
      />
      <PromptOptionGroup
        title="Формат"
        options={imagePromptPractice.formatOptions}
        selected={format}
        onSelect={setFormat}
        checked={checked}
      />

      <div>
        <p className="text-sm font-semibold text-foreground">Ограничения</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {imagePromptPractice.constraints.map((constraint) => {
            const active = constraints.includes(constraint.id);
            const showResult = checked;

            return (
              <button
                key={constraint.id}
                type="button"
                onClick={() => toggleConstraint(constraint.id)}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors",
                  showResult
                    ? constraint.required
                      ? active
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-amber-300 bg-amber-50"
                      : "border-red-200 bg-red-50"
                    : active
                      ? "border-[#f36f21] bg-[#fff7f1]"
                      : "border-black/10 bg-white hover:border-black/25"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground">
                    {constraint.label}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 text-[11px] font-medium",
                      showResult
                        ? constraint.required
                          ? active
                            ? "text-emerald-700"
                            : "text-amber-700"
                          : "text-red-700"
                        : active
                          ? "text-[#c8560f]"
                          : "text-muted-foreground"
                    )}
                  >
                    {showResult
                      ? constraint.required
                        ? active
                          ? "нужно"
                          : "пропущено"
                        : "лишнее"
                      : active
                        ? "выбрано"
                        : "не выбрано"}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {constraint.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-foreground">
          Собранный промпт
        </p>
        <p className="mt-2 rounded-lg bg-[#f9f8f5] p-3 text-sm leading-6 text-foreground/85">
          {assembledPrompt}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!ready}
          className="bg-[#f36f21] text-white hover:bg-[#d95c16] disabled:opacity-50"
        >
          <ListChecks className="h-4 w-4" />
          Проверить соответствие задаче
        </Button>
        <ReferenceButton
          open={referenceOpen}
          onToggle={() => setReferenceOpen((prev) => !prev)}
        />
        {!ready && (
          <span className="text-xs leading-5 text-muted-foreground">
            Заполните объект, назначение, четыре выбора и минимум четыре
            ограничения.
          </span>
        )}
      </div>

      {checked && (
        <div
          className={cn(
            "rounded-xl border p-4",
            choiceScore === 4 &&
              requiredSelected === requiredConstraints.length &&
              optionalSelected === 0
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Target className="h-4 w-4 text-[#f36f21]" />
            Композиция и оформление: {choiceScore} из 4 подходят
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground/80">
            Обязательных ограничений отмечено {requiredSelected} из{" "}
            {requiredConstraints.length}. Лишних ограничений: {optionalSelected}
            .
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground/80">
            Проверьте, что промпт отвечает на вопрос «какую мысль слайда
            поддерживает изображение» и не выдаёт иллюстрацию за доказательство
            реальных характеристик.
          </p>
        </div>
      )}

      {referenceOpen && (
        <div className="rounded-xl border border-black/10 bg-[#f9f8f5] p-4">
          <p className="text-sm font-semibold text-foreground">
            Эталонный промпт
          </p>
          <p className="mt-2 rounded-lg border border-black/10 bg-white p-3 text-sm leading-6 text-foreground/85">
            {imagePromptPractice.referencePrompt}
          </p>
          <ul className="mt-3 space-y-1.5">
            {imagePromptPractice.referenceNotes.map((note) => (
              <li
                key={note}
                className="flex gap-2 text-sm leading-6 text-foreground/80"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PresentationReviewPractice() {
  const [weakness, setWeakness] = useState<Partial<Record<string, boolean>>>(
    {}
  );
  const [claims, setClaims] = useState<Partial<Record<string, boolean>>>({});
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [structure, setStructure] = useState("");
  const [missingData, setMissingData] = useState("");
  const [checked, setChecked] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const slides = presentationReviewPractice.slides;
  const decided = slides.filter(
    (slide) => weakness[slide.id] !== undefined
  ).length;
  const weakSlides = slides.filter((slide) => slide.isWeak);
  const filledTitles = weakSlides.filter(
    (slide) => (titles[slide.id] ?? "").trim().length > 0
  ).length;
  const ready =
    decided === slides.length &&
    filledTitles === weakSlides.length &&
    structure.trim().length > 0 &&
    missingData.trim().length > 0;

  const correctWeak = slides.filter(
    (slide) => weakness[slide.id] === slide.isWeak
  ).length;
  const unsupportedClaims = slides.flatMap((slide) =>
    slide.claims.filter((claim) => !claim.supported)
  );
  const foundUnsupported = unsupportedClaims.filter(
    (claim) => claims[claim.id] === true
  ).length;
  const falseUnsupported = slides
    .flatMap((slide) => slide.claims)
    .filter((claim) => claim.supported && claims[claim.id] === true).length;

  const reset = () => {
    setWeakness({});
    setClaims({});
    setTitles({});
    setStructure("");
    setMissingData("");
    setChecked(false);
    setReferenceOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-[#f36f21]" />
          {presentationReviewPractice.deckTitle}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {presentationReviewPractice.meta}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {presentationReviewPractice.audience}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Цель
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground/80">
              {presentationReviewPractice.goal}
            </p>
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Запрос
            </p>
            <p className="mt-1 text-xs leading-5 text-foreground/80">
              {presentationReviewPractice.ask}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Отметьте слабые слайды и неподтверждённые утверждения, перепишите
          заголовки слабых слайдов, предложите структуру и недостающие данные.
        </p>
        <ResetButton onClick={reset} />
      </div>

      <ProgressLine
        answered={decided + filledTitles}
        total={slides.length + weakSlides.length}
        extra={`Заголовков: ${filledTitles}`}
      />

      <div className="space-y-3">
        {slides.map((slide) => {
          const decision = weakness[slide.id];
          const isCorrect = decision === slide.isWeak;

          return (
            <div
              key={slide.id}
              className={cn(
                "rounded-xl border bg-white p-4 sm:p-5",
                checked
                  ? isCorrect
                    ? "border-emerald-200"
                    : "border-red-200"
                  : "border-black/10"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Слайд {slide.number}
                </p>
                {checked && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      isCorrect ? "text-emerald-700" : "text-red-700"
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {isCorrect
                      ? "Оценка верна"
                      : slide.isWeak
                        ? "Слайд слабый"
                        : "Слайд сильный"}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {slide.title}
              </p>
              <ul className="mt-2 space-y-1.5 rounded-lg border border-black/10 bg-[#f9f8f5] p-3">
                {slide.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-2 text-xs leading-5 text-foreground/80"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#f36f21]" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Оценка слайда:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setWeakness((prev) => ({ ...prev, [slide.id]: true }))
                  }
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    decision === true
                      ? "border-[#f36f21] bg-[#fff7f1] text-[#c8560f]"
                      : "border-black/15 bg-white text-foreground hover:border-black/30"
                  )}
                >
                  Слабый
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setWeakness((prev) => ({ ...prev, [slide.id]: false }))
                  }
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    decision === false
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-black/15 bg-white text-foreground hover:border-black/30"
                  )}
                >
                  Сильный
                </button>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold text-foreground">
                  Отметьте неподтверждённые утверждения
                </p>
                <div className="mt-1.5 space-y-1.5">
                  {slide.claims.map((claim) => {
                    const active = claims[claim.id] === true;
                    const claimCorrect = active === !claim.supported;

                    return (
                      <button
                        key={claim.id}
                        type="button"
                        onClick={() =>
                          setClaims((prev) => ({
                            ...prev,
                            [claim.id]: !prev[claim.id],
                          }))
                        }
                        className={cn(
                          "flex w-full items-start gap-2 rounded-lg border p-2.5 text-left text-xs leading-5 transition-colors",
                          checked
                            ? claimCorrect
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-red-200 bg-red-50"
                            : active
                              ? "border-[#f36f21] bg-[#fff7f1]"
                              : "border-black/10 bg-white hover:border-black/25"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-semibold",
                            active
                              ? "border-[#f36f21] bg-[#f36f21] text-white"
                              : "border-black/25 bg-white text-transparent"
                          )}
                        >
                          ✓
                        </span>
                        <span className="flex-1 text-foreground/80">
                          {claim.text}
                          {checked && (
                            <span className="mt-1 block text-muted-foreground">
                              {claim.note}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="mt-3 block">
                <span className="text-sm font-semibold text-foreground">
                  {slide.isWeak
                    ? "Улучшенный заголовок-вывод"
                    : "Заголовок можно оставить или уточнить"}
                </span>
                <input
                  value={titles[slide.id] ?? ""}
                  onChange={(event) =>
                    setTitles((prev) => ({
                      ...prev,
                      [slide.id]: event.target.value,
                    }))
                  }
                  placeholder="Сформулируйте вывод, а не тему слайда"
                  className="mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                />
              </label>

              {checked && (
                <div className="mt-3 space-y-1.5 rounded-lg border border-black/10 bg-[#f9f8f5] p-3">
                  <p className="text-xs leading-5 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Почему слайд слабый:
                    </span>{" "}
                    {slide.weakness}
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Эталонный заголовок:
                    </span>{" "}
                    {slide.improvedTitle}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Новая структура презентации
          </span>
          <textarea
            value={structure}
            onChange={(event) => setStructure(event.target.value)}
            rows={5}
            placeholder="Опишите порядок слайдов и вывод каждого слайда"
            className="mt-1.5 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Недостающие данные
          </span>
          <textarea
            value={missingData}
            onChange={(event) => setMissingData(event.target.value)}
            rows={5}
            placeholder="Каких источников, расчётов и замеров не хватает"
            className="mt-1.5 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => setChecked(true)}
          disabled={!ready}
          className="bg-[#f36f21] text-white hover:bg-[#d95c16] disabled:opacity-50"
        >
          <ListChecks className="h-4 w-4" />
          Проверить разбор
        </Button>
        <ReferenceButton
          open={referenceOpen}
          onToggle={() => setReferenceOpen((prev) => !prev)}
        />
        {!ready && (
          <span className="text-xs leading-5 text-muted-foreground">
            Оцените все слайды, перепишите заголовки слабых, заполните структуру
            и недостающие данные.
          </span>
        )}
      </div>

      {checked && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Слабые слайды: {correctWeak} из {slides.length} оценены верно
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            Найдено неподтверждённых утверждений: {foundUnsupported} из{" "}
            {unsupportedClaims.length}. Ложных отметок: {falseUnsupported}.
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            Сверьте заголовки, структуру и список данных с эталоном. Сильный
            разбор не просто критикует, а предлагает, что исправить.
          </p>
        </div>
      )}

      {referenceOpen && (
        <div className="space-y-3 rounded-xl border border-black/10 bg-[#f9f8f5] p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Предлагаемая структура
            </p>
            <ul className="mt-2 space-y-1.5">
              {presentationReviewPractice.referenceStructure.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-foreground/80"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f36f21]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Недостающие данные
            </p>
            <ul className="mt-2 space-y-1.5">
              {presentationReviewPractice.missingData.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-foreground/80"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Общие правила проверки
            </p>
            <ul className="mt-2 space-y-1.5">
              {presentationReviewPractice.generalChecks.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-foreground/80"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
