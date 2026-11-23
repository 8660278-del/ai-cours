"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSecurityVerdictOption,
  scoreSecurityTrainer,
  securityTrainerSituations,
  securityVerdicts,
  type SecurityTrainerResult,
  type SecurityVerdict,
} from "@/lib/security-data";

interface SecurityTrainerProps {
  initialResult: SecurityTrainerResult | null;
}

const optionStyles: Record<SecurityVerdict, string> = {
  allowed:
    "border-emerald-200 bg-white text-emerald-900 hover:border-emerald-400 hover:bg-emerald-50",
  conditional:
    "border-amber-200 bg-white text-amber-900 hover:border-amber-400 hover:bg-amber-50",
  forbidden:
    "border-red-200 bg-white text-red-900 hover:border-red-400 hover:bg-red-50",
};

const selectedStyles: Record<SecurityVerdict, string> = {
  allowed: "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-400",
  conditional: "border-amber-500 bg-amber-50 ring-1 ring-amber-400",
  forbidden: "border-red-500 bg-red-50 ring-1 ring-red-400",
};

const correctOptionStyles: Record<SecurityVerdict, string> = {
  allowed: "border-emerald-500 bg-emerald-50",
  conditional: "border-amber-500 bg-amber-50",
  forbidden: "border-red-500 bg-red-50",
};

export function SecurityTrainer({ initialResult }: SecurityTrainerProps) {
  const [answers, setAnswers] = useState<Record<string, SecurityVerdict>>(
    initialResult?.answers ?? {}
  );
  const [pending, setPending] = useState(false);

  const { correct, total } = scoreSecurityTrainer(answers);
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total;

  async function saveAnswers(nextAnswers: Record<string, SecurityVerdict>) {
    setPending(true);

    try {
      const response = await fetch("/api/security-trainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: nextAnswers }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(
          data?.error ??
            "Не удалось сохранить результат. Проверьте подключение и попробуйте ещё раз."
        );
      }

      toast.success("Результат тренажёра сохранён", {
        description: "Итог будет виден на странице «Мой прогресс».",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось сохранить результат. Попробуйте ещё раз.";

      toast.error("Не удалось сохранить результат", {
        description: message,
        action: {
          label: "Повторить",
          onClick: () => {
            void saveAnswers(nextAnswers);
          },
        },
      });
    } finally {
      setPending(false);
    }
  }

  function choose(situationId: string, verdict: SecurityVerdict) {
    const nextAnswers = { ...answers, [situationId]: verdict };
    setAnswers(nextAnswers);
    void saveAnswers(nextAnswers);
  }

  function resetTrainer() {
    const nextAnswers: Record<string, SecurityVerdict> = {};
    setAnswers(nextAnswers);
    void saveAnswers(nextAnswers);
  }

  function confirmReset() {
    toast("Начать тренажёр заново?", {
      description: "Сохранённый результат будет очищен.",
      action: { label: "Сбросить", onClick: resetTrainer },
      cancel: { label: "Отмена", onClick: () => {} },
    });
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-black/10 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-[#f36f21]" />
              Тренажёр ситуаций
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Для каждой ситуации выберите одно решение. После ответа появится
              объяснение, а результат сохранится в вашем прогрессе.
            </p>
          </div>
          <div className="shrink-0 rounded-lg border border-black/10 bg-[#f9f8f5] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Правильно
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {correct}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / {total}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Разобрано {answered} из {total}
            </p>
          </div>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#e8e5df]">
          <div
            className="h-full rounded-full bg-[#f36f21] transition-all"
            style={{ width: `${Math.round((answered / total) * 100)}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {pending
              ? "Сохраняем результат..."
              : allAnswered
                ? "Все ситуации разобраны. Результат сохранён на сервере."
                : "Выберите ответ для каждой ситуации."}
          </p>
          {pending && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Сохранение
            </span>
          )}
          {answered > 0 && !pending && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={confirmReset}
              className="ml-auto h-8 border-black/15 bg-white text-foreground hover:bg-[#f3f1ec]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Пройти заново
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {securityTrainerSituations.map((situation, index) => {
          const choice = answers[situation.id];
          const isAnswered = choice !== undefined;
          const isCorrect = choice === situation.correct;
          const correctOption = getSecurityVerdictOption(situation.correct);
          const chosenOption = choice ? getSecurityVerdictOption(choice) : null;

          return (
            <article
              key={situation.id}
              className="rounded-xl border border-black/10 bg-white p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#171717] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {situation.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground/80">
                    {situation.scenario}
                  </p>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 pl-11">
                {situation.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex gap-2 text-xs leading-5 text-muted-foreground sm:text-sm"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#f36f21]"
                      aria-hidden="true"
                    />
                    {detail}
                  </li>
                ))}
              </ul>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {securityVerdicts.map((option) => {
                  const selected = choice === option.id;
                  const isCorrectOption =
                    isAnswered && option.id === situation.correct;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => choose(situation.id, option.id)}
                      disabled={pending}
                      aria-pressed={selected}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors disabled:opacity-70",
                        optionStyles[option.id],
                        selected && selectedStyles[option.id],
                        !selected &&
                          isCorrectOption &&
                          correctOptionStyles[option.id]
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={cn(
                    "mt-4 rounded-lg border p-4",
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          isCorrect ? "text-emerald-900" : "text-red-900"
                        )}
                      >
                        {isCorrect
                          ? "Верно"
                          : `Неверно. Правильный ответ: ${correctOption?.label.toLowerCase()}`}
                      </p>
                      {!isCorrect && chosenOption && (
                        <p className="mt-1 text-xs text-red-800">
                          Вы выбрали: {chosenOption.label.toLowerCase()}.
                        </p>
                      )}
                      <p
                        className={cn(
                          "mt-2 text-sm leading-6",
                          isCorrect ? "text-emerald-900/85" : "text-red-900/85"
                        )}
                      >
                        {situation.explanation}
                      </p>
                      {situation.conditions && (
                        <p className="mt-2 flex gap-2 text-xs leading-5 text-emerald-900/75">
                          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {situation.conditions}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-6 text-amber-900/85">
            Тренажёр — учебный ориентир. Если ситуация не описана или вызывает
            сомнение, остановитесь и уточните правило у ответственного за
            информационную безопасность. Окончательные правила определяет
            политика информационной безопасности компании.
          </p>
        </div>
      </div>
    </div>
  );
}
