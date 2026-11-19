"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  Lightbulb,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  followUpCase,
  promptBuilderExample,
  promptBuilderFields,
  riskCategories,
  riskSituations,
  toolCategories,
  toolTasks,
  verifyAnswers,
  type RiskCategory,
  type ToolId,
} from "@/lib/module1-interactive-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ResetButton({
  onClick,
  label = "Пройти заново",
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
      className="border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
    >
      <RotateCcw className="h-4 w-4" />
      {label}
    </Button>
  );
}

function ProgressLine({
  answered,
  total,
  correct,
}: {
  answered: number;
  total: number;
  correct?: number;
}) {
  const percent = Math.round((answered / total) * 100);

  return (
    <div className="rounded-lg border border-black/10 bg-[#f9f8f5] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Разобрано {answered} из {total}
        </span>
        {typeof correct === "number" && answered > 0 && (
          <span>Верно: {correct}</span>
        )}
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

function VerifyAnswers() {
  const [choices, setChoices] = useState<Record<string, boolean>>({});
  const answered = Object.keys(choices).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Для каждого ответа выберите, можно ли использовать его без проверки.
        </p>
        {answered > 0 && (
          <ResetButton onClick={() => setChoices({})} label="Сбросить ответы" />
        )}
      </div>

      <ProgressLine answered={answered} total={verifyAnswers.length} />

      {verifyAnswers.map((item, index) => {
        const choice = choices[item.id];
        const answeredItem = choice !== undefined;
        const selectedCorrect = choice === true;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-black/10 bg-white p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Ответ {index + 1}
              </p>
              {answeredItem && (
                <span className="rounded-full border border-black/10 bg-[#f3f1ec] px-2.5 py-1 text-xs font-medium text-foreground">
                  {item.type}
                </span>
              )}
            </div>

            <p className="mt-3 text-sm font-medium text-foreground">
              Запрос к нейросети
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {item.prompt}
            </p>

            <div className="mt-3 rounded-lg border border-black/10 bg-[#f9f8f5] p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Ответ нейросети
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                {item.answer}
              </p>
            </div>

            {!answeredItem ? (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    setChoices((prev) => ({ ...prev, [item.id]: true }))
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#f36f21]/40 bg-[#fff7f1] px-4 py-2.5 text-sm font-medium text-[#c8560f] transition-colors hover:bg-[#ffeddf]"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Требует проверки
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setChoices((prev) => ({ ...prev, [item.id]: false }))
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[#f9f8f5]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Можно использовать как есть
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg border p-3.5",
                    selectedCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  {selectedCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        selectedCorrect ? "text-emerald-900" : "text-red-900"
                      )}
                    >
                      {selectedCorrect
                        ? "Верно: ответ нужно проверить."
                        : "Неверно: ответ нельзя использовать без проверки."}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm leading-6",
                        selectedCorrect ? "text-emerald-800" : "text-red-800"
                      )}
                    >
                      {item.explanation}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setChoices((prev) => {
                      const next = { ...prev };
                      delete next[item.id];
                      return next;
                    })
                  }
                  className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Изменить ответ
                </button>
              </div>
            )}
          </div>
        );
      })}

      {answered === verifyAnswers.length && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-6 text-emerald-900">
            Все пять ответов разобраны. Вывод: проверять нужно любой ответ —
            вопрос лишь в том, что именно проверять и насколько высок риск
            ошибки.
          </p>
        </div>
      )}
    </div>
  );
}

const riskStyles: Record<RiskCategory, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-900",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  high: "border-red-200 bg-red-50 text-red-900",
};

function ClassifyRisks() {
  const [answers, setAnswers] = useState<Record<string, RiskCategory>>({});
  const answered = Object.keys(answers).length;
  const correctCount = riskSituations.filter(
    (item) => answers[item.id] === item.correct
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Выберите категорию для каждой ситуации. После ответа появится
          объяснение.
        </p>
        {answered > 0 && (
          <ResetButton onClick={() => setAnswers({})} label="Сбросить ответы" />
        )}
      </div>

      <ProgressLine
        answered={answered}
        total={riskSituations.length}
        correct={correctCount}
      />

      {riskSituations.map((item, index) => {
        const choice = answers[item.id];
        const isAnswered = choice !== undefined;
        const isCorrect = choice === item.correct;
        const correctCategory = riskCategories.find(
          (category) => category.id === item.correct
        );

        return (
          <div
            key={item.id}
            className="rounded-xl border border-black/10 bg-white p-4 sm:p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Ситуация {index + 1}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {item.situation}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {riskCategories.map((category) => {
                const selected = choice === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [item.id]: category.id,
                      }))
                    }
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors sm:text-sm",
                      selected
                        ? riskStyles[category.id]
                        : "border-black/15 bg-[#fbfaf7] text-foreground hover:border-black/30"
                    )}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-4 space-y-3">
                <div
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg border p-3.5",
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isCorrect ? "text-emerald-900" : "text-red-900"
                      )}
                    >
                      {isCorrect
                        ? `Верно: ${correctCategory?.label}.`
                        : `Неверно. Правильная категория: ${correctCategory?.label}.`}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm leading-6",
                        isCorrect ? "text-emerald-800" : "text-red-800"
                      )}
                    >
                      {item.explanation}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => {
                      const next = { ...prev };
                      delete next[item.id];
                      return next;
                    })
                  }
                  className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Изменить решение
                </button>
              </div>
            )}
          </div>
        );
      })}

      {answered === riskSituations.length && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-6 text-emerald-900">
            Все десять ситуаций разобраны. Верных решений: {correctCount} из{" "}
            {riskSituations.length}. Главный критерий — не «можно или нельзя», а
            какие данные передаются и какие последствия возможны.
          </p>
        </div>
      )}
    </div>
  );
}

function ToolChoice() {
  const [answers, setAnswers] = useState<Record<string, ToolId>>({});
  const answered = Object.keys(answers).length;
  const correctCount = toolTasks.filter(
    (item) => answers[item.id] === item.correct
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Для каждой задачи выберите категорию инструмента. Названия сервисов —
          примеры, важен тип инструмента.
        </p>
        {answered > 0 && (
          <ResetButton onClick={() => setAnswers({})} label="Сбросить ответы" />
        )}
      </div>

      <ProgressLine
        answered={answered}
        total={toolTasks.length}
        correct={correctCount}
      />

      {toolTasks.map((item, index) => {
        const choice = answers[item.id];
        const isAnswered = choice !== undefined;
        const isCorrect = choice === item.correct;
        const correctCategory = toolCategories.find(
          (category) => category.id === item.correct
        );

        return (
          <div
            key={item.id}
            className="rounded-xl border border-black/10 bg-white p-4 sm:p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Задача {index + 1}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {item.task}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {toolCategories.map((category) => {
                const selected = choice === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [item.id]: category.id,
                      }))
                    }
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      selected
                        ? "border-[#f36f21] bg-[#fff7f1] text-[#c8560f]"
                        : "border-black/15 bg-[#fbfaf7] text-foreground hover:border-black/30"
                    )}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-4 space-y-3">
                <div
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg border p-3.5",
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        isCorrect ? "text-emerald-900" : "text-red-900"
                      )}
                    >
                      {isCorrect
                        ? `Верно: ${correctCategory?.label}.`
                        : `Неверно. Подходящая категория: ${correctCategory?.label}.`}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm leading-6",
                        isCorrect ? "text-emerald-800" : "text-red-800"
                      )}
                    >
                      {item.explanation}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => {
                      const next = { ...prev };
                      delete next[item.id];
                      return next;
                    })
                  }
                  className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Изменить ответ
                </button>
              </div>
            )}
          </div>
        );
      })}

      {answered === toolTasks.length && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-6 text-emerald-900">
            Все восемь задач разобраны. Верных решений: {correctCount} из{" "}
            {toolTasks.length}. Сложную задачу часто лучше разделить на этапы и
            использовать разные инструменты.
          </p>
        </div>
      )}
    </div>
  );
}

function PromptBuilder() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const filledFields = promptBuilderFields.filter(
    (field) => (values[field.id] ?? "").trim().length > 0
  ).length;

  const composed = promptBuilderFields
    .map((field) => {
      const value = (values[field.id] ?? "").trim();
      if (!value) {
        return null;
      }
      return `${field.prefix} ${value}`;
    })
    .filter((line): line is string => Boolean(line))
    .join("\n\n");

  const handleCopy = async () => {
    if (!composed) {
      return;
    }

    try {
      await navigator.clipboard.writeText(composed);
      setCopied(true);
      toast.success("Промпт скопирован", {
        description: "Текст готов к вставке в ИИ-сервис.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать", {
        description: "Выделите текст в поле результата и скопируйте вручную.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Заполните шесть полей — готовый промпт собирается автоматически.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setValues({ ...promptBuilderExample })}
            className="border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
          >
            <Sparkles className="h-4 w-4" />
            Заполнить примером
          </Button>
          <ResetButton onClick={() => setValues({})} label="Очистить поля" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {promptBuilderFields.map((field) => (
          <label key={field.id} className="block">
            <span className="text-sm font-semibold text-foreground">
              {field.label}
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              {field.hint}
            </span>
            <textarea
              value={values[field.id] ?? ""}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  [field.id]: event.target.value,
                }))
              }
              placeholder={field.placeholder}
              rows={3}
              className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl bg-[#171717] p-4 text-white sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
            Готовый промпт
          </p>
          <span className="text-xs text-white/60">
            Заполнено {filledFields} из {promptBuilderFields.length} полей
          </span>
        </div>
        <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-white/90">
          {composed ||
            "Заполните поля выше или нажмите «Заполнить примером», чтобы увидеть готовый текст."}
        </pre>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => {
              void handleCopy();
            }}
            disabled={!composed}
            className="bg-[#f36f21] text-white hover:bg-[#d95c16] disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Скопировать промпт
              </>
            )}
          </Button>
          <span className="text-xs leading-5 text-white/55">
            Перед использованием проверьте данные и ограничения.
          </span>
        </div>
      </div>

      {filledFields === promptBuilderFields.length && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-6 text-emerald-900">
            Все шесть компонентов заполнены. Такой промпт можно сохранить в
            личной библиотеке и повторно использовать, заменяя данные.
          </p>
        </div>
      )}
    </div>
  );
}

function FollowUp() {
  const [requests, setRequests] = useState<[string, string]>(["", ""]);
  const [revealed, setRevealed] = useState(false);

  const updateRequest = (index: 0 | 1, value: string) => {
    setRequests((prev) => {
      const next: [string, string] = [prev[0], prev[1]];
      next[index] = value;
      return next;
    });
  };

  const filled = requests.filter((request) => request.trim().length > 0).length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-900/70">
              Первый результат
            </p>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              {followUpCase.badResult}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-foreground">
          Что не так с результатом
        </p>
        <ul className="mt-2 space-y-1.5">
          {followUpCase.problems.map((problem) => (
            <li
              key={problem}
              className="flex gap-2 text-sm leading-6 text-muted-foreground"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              {problem}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {([0, 1] as const).map((index) => (
          <label key={index} className="block">
            <span className="text-sm font-semibold text-foreground">
              Уточняющий запрос {index + 1}
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
              Опишите конкретно: что исправить, что добавить и что сохранить.
            </span>
            <textarea
              value={requests[index]}
              onChange={(event) => updateRequest(index, event.target.value)}
              rows={3}
              placeholder={
                index === 0
                  ? "Например: добавь новую дату и убери обещание компенсации..."
                  : "Например: измени тон, добавь тему письма и следующий шаг..."
              }
              className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => setRevealed(true)}
          className="bg-[#171717] text-white hover:bg-black"
        >
          <Lightbulb className="h-4 w-4 text-[#f36f21]" />
          Показать эталон
        </Button>
        {filled === 2 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Оба запроса заполнены
          </span>
        )}
        {(filled > 0 || revealed) && (
          <ResetButton
            onClick={() => {
              setRequests(["", ""]);
              setRevealed(false);
            }}
            label="Начать заново"
          />
        )}
      </div>

      {revealed && (
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Примеры уточняющих запросов
          </p>
          <ul className="space-y-2">
            {followUpCase.referenceRequests.map((request, index) => (
              <li
                key={request}
                className="rounded-lg border border-emerald-200 bg-white p-3 text-sm leading-6 text-foreground/85"
              >
                {index + 1}. {request}
              </li>
            ))}
          </ul>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Чек-лист самопроверки
            </p>
            <ul className="mt-2 space-y-1.5">
              {followUpCase.checklist.map((item) => (
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

export function LessonInteractive({
  interactiveId,
}: {
  interactiveId: string;
}) {
  if (interactiveId === "verify-answers") {
    return <VerifyAnswers />;
  }

  if (interactiveId === "classify-risks") {
    return <ClassifyRisks />;
  }

  if (interactiveId === "tool-choice") {
    return <ToolChoice />;
  }

  if (interactiveId === "prompt-builder") {
    return <PromptBuilder />;
  }

  if (interactiveId === "follow-up") {
    return <FollowUp />;
  }

  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
      <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <p className="text-sm leading-6 text-muted-foreground">
        Интерактивный блок этого урока скоро появится.
      </p>
    </div>
  );
}
