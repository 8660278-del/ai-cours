"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Lightbulb,
  RotateCcw,
  ShieldQuestion,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataSafety } from "@/components/lesson2-interactive";
import { cn } from "@/lib/utils";
import {
  comparePractice,
  protocolPractice,
  reviewPractice,
  type ReviewErrorType,
} from "@/lib/module2-interactive-data";

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-8 border-black/15 bg-white text-foreground hover:bg-[#f3f1ec]"
    >
      <RotateCcw className="h-3.5 w-3.5" />
      Сбросить
    </Button>
  );
}

function CheckButton({
  onClick,
  label = "Проверить",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button
      type="button"
      size="sm"
      onClick={onClick}
      className="h-9 bg-[#f36f21] text-white hover:bg-[#d95c16]"
    >
      <CheckCircle2 className="h-4 w-4" />
      {label}
    </Button>
  );
}

function ReferencePanel({
  open,
  onToggle,
  items,
}: {
  open: boolean;
  onToggle: () => void;
  items: string[];
}) {
  return (
    <div className="mt-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
      >
        <Lightbulb className="h-4 w-4 text-emerald-600" />
        {open ? "Скрыть эталон" : "Показать эталон"}
      </Button>
      {open && (
        <ul className="mt-3 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm leading-6 text-emerald-900/85"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DraftField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <label className="mt-4 block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
      />
    </label>
  );
}

export function ProtocolPractice() {
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [draft, setDraft] = useState("");

  const distortions = protocolPractice.rows.filter((row) =>
    Boolean(row.distortion)
  );
  const markedRows = protocolPractice.rows.filter((row) => marked[row.id]);
  const found = distortions.filter((row) => marked[row.id]).length;
  const perfect =
    checked &&
    found === distortions.length &&
    markedRows.length === distortions.length;

  const toggle = (id: string) => {
    setMarked((prev) => ({ ...prev, [id]: !prev[id] }));
    setChecked(false);
  };

  const reset = () => {
    setMarked({});
    setChecked(false);
    setRevealed(false);
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="h-4 w-4 text-[#f36f21]" />
          {protocolPractice.situationTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {protocolPractice.situation}
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Стенограмма встречи
        </p>
        <ul className="mt-2 space-y-2">
          {protocolPractice.transcript.map((line) => (
            <li
              key={line}
              className="flex gap-2 text-sm leading-6 text-foreground/80"
            >
              <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f36f21]"
                aria-hidden="true"
              />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <DataSafety question={protocolPractice.safety} />

      <div className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {protocolPractice.draftTitle}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {protocolPractice.draftNote}
            </p>
          </div>
          <span className="rounded-full bg-[#f3f1ec] px-2.5 py-1 text-xs font-medium text-foreground">
            Отмечено: {markedRows.length}
          </span>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-black/10">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead className="bg-[#f3f1ec] text-xs uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Вопрос</th>
                <th className="px-3 py-2.5 font-semibold">Решение</th>
                <th className="px-3 py-2.5 font-semibold">Задача</th>
                <th className="px-3 py-2.5 font-semibold">Ответственный</th>
                <th className="px-3 py-2.5 font-semibold">Срок</th>
                <th className="px-3 py-2.5 font-semibold">Искажение?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {protocolPractice.rows.map((row) => {
                const isDistortion = Boolean(row.distortion);
                const isMarked = Boolean(marked[row.id]);
                const highlight = checked
                  ? isDistortion && isMarked
                    ? "bg-emerald-50"
                    : isDistortion && !isMarked
                      ? "bg-red-50"
                      : !isDistortion && isMarked
                        ? "bg-amber-50"
                        : "bg-white"
                  : "bg-white";

                return (
                  <tr key={row.id} className={highlight}>
                    <td className="px-3 py-2.5 text-foreground/85">
                      {row.question}
                    </td>
                    <td className="px-3 py-2.5 text-foreground/85">
                      {row.decision}
                    </td>
                    <td className="px-3 py-2.5 text-foreground/85">
                      {row.task}
                    </td>
                    <td className="px-3 py-2.5 text-foreground/85">
                      {row.owner}
                    </td>
                    <td className="px-3 py-2.5 text-foreground/85">
                      {row.deadline}
                    </td>
                    <td className="px-3 py-2.5">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-foreground/75">
                        <input
                          type="checkbox"
                          checked={isMarked}
                          onChange={() => toggle(row.id)}
                          className="h-4 w-4 accent-[#f36f21]"
                        />
                        {isMarked ? "Отмечено" : "Отметить"}
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CheckButton onClick={() => setChecked(true)} />
          <ResetButton onClick={reset} />
        </div>

        {checked && (
          <div
            className={cn(
              "mt-3 rounded-lg border p-3.5",
              perfect
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                perfect ? "text-emerald-900" : "text-amber-900"
              )}
            >
              {perfect ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {perfect
                ? "Оба искажения найдены"
                : `Найдено ${found} из ${distortions.length}. Проверьте отметки ещё раз.`}
            </p>
            <ul className="mt-2 space-y-2">
              {distortions.map((row) => (
                <li
                  key={row.id}
                  className="text-sm leading-6 text-foreground/80"
                >
                  <span className="font-semibold">
                    {marked[row.id] ? "Найдено: " : "Пропущено: "}
                  </span>
                  {row.question}. {row.distortion}
                </li>
              ))}
              {markedRows
                .filter((row) => !row.distortion)
                .map((row) => (
                  <li
                    key={row.id}
                    className="text-sm leading-6 text-foreground/80"
                  >
                    <span className="font-semibold">Лишняя отметка: </span>
                    {row.question}. Эта строка соответствует стенограмме.
                  </li>
                ))}
            </ul>
          </div>
        )}

        <DraftField
          label="Ваш итоговый протокол (таблица)"
          value={draft}
          onChange={setDraft}
          rows={8}
          placeholder={
            "Вопрос | Решение | Задача | Ответственный | Срок\n\nПеренос поставки | 18 марта | Сообщить клиенту | Смирнова | 14 марта\n..."
          }
        />

        <ReferencePanel
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
          items={protocolPractice.referenceItems}
        />
      </div>
    </div>
  );
}

export function ComparePractice() {
  const [attention, setAttention] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [draft, setDraft] = useState("");

  const important = comparePractice.differences.filter(
    (difference) => difference.requiresAttention
  );
  const selected = comparePractice.differences.filter(
    (difference) => attention[difference.id]
  );
  const found = important.filter(
    (difference) => attention[difference.id]
  ).length;
  const perfect =
    checked &&
    found === important.length &&
    selected.length === important.length;

  const toggle = (id: string) => {
    setAttention((prev) => ({ ...prev, [id]: !prev[id] }));
    setChecked(false);
  };

  const reset = () => {
    setAttention({});
    setChecked(false);
    setRevealed(false);
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileSearch className="h-4 w-4 text-[#f36f21]" />
          {comparePractice.situationTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {comparePractice.situation}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {comparePractice.docATitle}
          </p>
          <ul className="mt-2 space-y-2">
            {comparePractice.docA.map((line) => (
              <li key={line} className="text-sm leading-6 text-foreground/80">
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-[#f36f21]/25 bg-[#fff7f1] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#c8560f]">
            {comparePractice.docBTitle}
          </p>
          <ul className="mt-2 space-y-2">
            {comparePractice.docB.map((line) => (
              <li key={line} className="text-sm leading-6 text-foreground/80">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <DataSafety question={comparePractice.safety} />

      <div className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Таблица отличий
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Отметьте изменения, которые требуют внимания ответственного
              сотрудника: финансов, юриста или логистики.
            </p>
          </div>
          <span className="rounded-full bg-[#f3f1ec] px-2.5 py-1 text-xs font-medium text-foreground">
            Отмечено: {selected.length}
          </span>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-black/10">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="bg-[#f3f1ec] text-xs uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Пункт</th>
                <th className="px-3 py-2.5 font-semibold">Редакция 1</th>
                <th className="px-3 py-2.5 font-semibold">Редакция 2</th>
                <th className="px-3 py-2.5 font-semibold">Что изменилось</th>
                <th className="px-3 py-2.5 font-semibold">Требует внимания</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {comparePractice.differences.map((difference) => {
                const isMarked = Boolean(attention[difference.id]);
                const highlight = checked
                  ? difference.requiresAttention && isMarked
                    ? "bg-emerald-50"
                    : difference.requiresAttention && !isMarked
                      ? "bg-red-50"
                      : !difference.requiresAttention && isMarked
                        ? "bg-amber-50"
                        : "bg-white"
                  : "bg-white";

                return (
                  <tr key={difference.id} className={highlight}>
                    <td className="px-3 py-2.5 align-top text-foreground/85">
                      {difference.parameter}
                    </td>
                    <td className="px-3 py-2.5 align-top text-foreground/75">
                      {difference.before}
                    </td>
                    <td className="px-3 py-2.5 align-top text-foreground/75">
                      {difference.after}
                    </td>
                    <td className="px-3 py-2.5 align-top text-foreground/85">
                      {difference.change}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-foreground/75">
                        <input
                          type="checkbox"
                          checked={isMarked}
                          onChange={() => toggle(difference.id)}
                          className="h-4 w-4 accent-[#f36f21]"
                        />
                        {isMarked ? "Отмечено" : "Отметить"}
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CheckButton onClick={() => setChecked(true)} />
          <ResetButton onClick={reset} />
        </div>

        {checked && (
          <div
            className={cn(
              "mt-3 rounded-lg border p-3.5",
              perfect
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                perfect ? "text-emerald-900" : "text-amber-900"
              )}
            >
              {perfect ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {perfect
                ? "Все изменения, требующие внимания, отмечены"
                : `Отмечено ${found} из ${important.length} значимых изменений. Проверьте отметки.`}
            </p>
            <ul className="mt-2 space-y-2">
              {comparePractice.differences.map((difference) => (
                <li
                  key={difference.id}
                  className="text-sm leading-6 text-foreground/80"
                >
                  <span className="font-semibold">
                    {difference.requiresAttention
                      ? attention[difference.id]
                        ? "Найдено: "
                        : "Пропущено: "
                      : attention[difference.id]
                        ? "Лишняя отметка: "
                        : "Без внимания: "}
                  </span>
                  {difference.parameter}. {difference.explanation}
                </li>
              ))}
            </ul>
          </div>
        )}

        <DraftField
          label="Вывод для ответственного сотрудника"
          value={draft}
          onChange={setDraft}
          placeholder="Что изменилось, какие пункты требуют согласования и что нужно сделать до подписания новой редакции."
        />

        <ReferencePanel
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
          items={comparePractice.referenceItems}
        />
      </div>
    </div>
  );
}

const reviewOptions: { value: ReviewErrorType; label: string }[] = [
  { value: "deadline", label: "Пропущен срок" },
  { value: "contradiction", label: "Противоречие между пунктами" },
  { value: "obligation", label: "Неподтверждённое обязательство" },
  { value: "wording", label: "Неясная формулировка" },
  { value: "none", label: "Ошибки нет" },
];

const reviewTypeLabel: Record<ReviewErrorType, string> = {
  deadline: "Пропущен срок",
  contradiction: "Противоречие между пунктами",
  obligation: "Неподтверждённое обязательство",
  wording: "Неясная формулировка",
  none: "Ошибки нет",
};

export function ReviewPractice() {
  const [answers, setAnswers] = useState<Record<string, ReviewErrorType | "">>(
    {}
  );
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [draft, setDraft] = useState("");

  const errorFragments = reviewPractice.fragments.filter(
    (fragment) => fragment.correctType !== "none"
  );
  const correctCount = reviewPractice.fragments.filter(
    (fragment) => answers[fragment.id] === fragment.correctType
  ).length;
  const allCorrect =
    checked &&
    reviewPractice.fragments.every(
      (fragment) => answers[fragment.id] === fragment.correctType
    );

  const setAnswer = (id: string, value: ReviewErrorType | "") => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setChecked(false);
  };

  const reset = () => {
    setAnswers({});
    setChecked(false);
    setRevealed(false);
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShieldQuestion className="h-4 w-4 text-[#f36f21]" />
          {reviewPractice.situationTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {reviewPractice.situation}
        </p>
      </div>

      <DataSafety question={reviewPractice.safety} />

      <div className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">
            {reviewPractice.documentTitle}
          </p>
          <span className="rounded-full bg-[#f3f1ec] px-2.5 py-1 text-xs font-medium text-foreground">
            Проверено пунктов:{" "}
            {
              reviewPractice.fragments.filter(
                (fragment) => answers[fragment.id]
              ).length
            }{" "}
            из {reviewPractice.fragments.length}
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {reviewPractice.fragments.map((fragment) => {
            const answer = answers[fragment.id] ?? "";
            const correct = answer === fragment.correctType;

            return (
              <div
                key={fragment.id}
                className={cn(
                  "rounded-lg border p-3.5",
                  checked
                    ? correct
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                    : "border-black/10 bg-[#fbfaf7]"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {fragment.clause}
                  </p>
                  {checked && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold",
                        correct ? "text-emerald-700" : "text-red-700"
                      )}
                    >
                      {correct ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {correct ? "Верно" : "Неверно"}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-6 text-foreground/85">
                  {fragment.text}
                </p>

                <label className="mt-2.5 block">
                  <span className="text-xs text-muted-foreground">
                    Тип ошибки
                  </span>
                  <select
                    value={answer}
                    onChange={(event) =>
                      setAnswer(
                        fragment.id,
                        event.target.value as ReviewErrorType | ""
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                  >
                    <option value="">Выберите тип</option>
                    {reviewOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                {checked && (
                  <div className="mt-2.5 rounded-lg border border-black/10 bg-white p-3">
                    <p className="text-xs font-semibold text-foreground">
                      Правильный ответ: {reviewTypeLabel[fragment.correctType]}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-foreground/80">
                      {fragment.explanation}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-foreground/80">
                      <span className="font-semibold">Как исправить: </span>
                      {fragment.corrected}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CheckButton onClick={() => setChecked(true)} />
          <ResetButton onClick={reset} />
        </div>

        {checked && (
          <div
            className={cn(
              "mt-3 rounded-lg border p-3.5",
              allCorrect
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                allCorrect ? "text-emerald-900" : "text-amber-900"
              )}
            >
              {allCorrect ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {allCorrect
                ? "Все четыре ошибки найдены верно"
                : `Верно определено ${correctCount} из ${reviewPractice.fragments.length} пунктов. Найдите четыре ошибки: ${errorFragments
                    .map((fragment) => reviewTypeLabel[fragment.correctType])
                    .join(", ")}.`}
            </p>
          </div>
        )}

        <DraftField
          label="Исправленный документ"
          value={draft}
          onChange={setDraft}
          rows={8}
          placeholder="Служебная записка: закупка серверного оборудования\n\nП. 1. Оформить договор ... до 20 марта 2025 года.\n..."
        />

        <ReferencePanel
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
          items={reviewPractice.referenceItems}
        />
      </div>
    </div>
  );
}
