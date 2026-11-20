"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileSearch,
  Lightbulb,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  analyticalReviewPractice,
  extractionPractice,
  indicatorPractice,
  sourceVerificationPractice,
  spreadsheetAuditPractice,
  textAnalysisPractice,
  type ConclusionCategory,
  type ReasoningCategory,
  type ReviewErrorType,
  type SourceVerdict,
  type SpreadsheetIssue,
} from "@/lib/module3-interactive-data";

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

function ScoreLine({
  answered,
  total,
  correct,
}: {
  answered: number;
  total: number;
  correct: number;
}) {
  const percent = Math.round((answered / total) * 100);

  return (
    <div className="rounded-lg border border-black/10 bg-[#f9f8f5] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Разобрано {answered} из {total}
        </span>
        {answered > 0 && <span>Верно: {correct}</span>}
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

const categoryStyles: Record<ConclusionCategory, string> = {
  confirmed:
    "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
  verify: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
  contradicts: "border-red-200 bg-red-50 text-red-900 hover:bg-red-100",
};

export function TextAnalysisPractice() {
  const [choices, setChoices] = useState<Record<string, ConclusionCategory>>(
    {}
  );
  const [notes, setNotes] = useState("");
  const [revealed, setRevealed] = useState(false);

  const answered = Object.keys(choices).length;
  const correct = textAnalysisPractice.statements.filter(
    (statement) => choices[statement.id] === statement.correct
  ).length;
  const allAnswered = answered === textAnalysisPractice.statements.length;

  const reset = () => {
    setChoices({});
    setNotes("");
    setRevealed(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileSearch className="h-4 w-4 text-[#f36f21]" />
          Учебный документ
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {textAnalysisPractice.documentMeta}
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">
          {textAnalysisPractice.documentTitle}
        </p>

        <div className="mt-3 max-h-80 space-y-4 overflow-y-auto rounded-lg border border-black/10 bg-white p-4">
          {textAnalysisPractice.sections.map((section) => (
            <div key={section.id}>
              <p className="text-sm font-semibold text-foreground">
                {section.title}
              </p>
              <div className="mt-1.5 space-y-1.5">
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
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Определите, что документ подтверждает, что требует проверки, а чему
          противоречит. После выбора появится ссылка на пункт.
        </p>
        {answered > 0 && (
          <ResetButton onClick={reset} label="Сбросить ответы" />
        )}
      </div>

      <ScoreLine
        answered={answered}
        total={textAnalysisPractice.statements.length}
        correct={correct}
      />

      <div className="space-y-3">
        {textAnalysisPractice.statements.map((statement, index) => {
          const choice = choices[statement.id];
          const isAnswered = choice !== undefined;
          const isCorrect = choice === statement.correct;
          const correctCategory = textAnalysisPractice.categories.find(
            (category) => category.id === statement.correct
          );

          return (
            <div
              key={statement.id}
              className="rounded-xl border border-black/10 bg-white p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Утверждение {index + 1}
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {statement.text}
              </p>

              {!isAnswered ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {textAnalysisPractice.categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        setChoices((prev) => ({
                          ...prev,
                          [statement.id]: category.id,
                        }))
                      }
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors",
                        categoryStyles[category.id]
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      "rounded-lg border p-3.5",
                      isCorrect
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                    )}
                  >
                    <p
                      className={cn(
                        "flex items-center gap-2 text-sm font-semibold",
                        isCorrect ? "text-emerald-900" : "text-red-900"
                      )}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {isCorrect
                        ? `Верно: ${correctCategory?.label}.`
                        : `Неверно. Правильный вывод: ${correctCategory?.label}.`}
                    </p>
                    <p className="mt-1 text-xs font-medium text-foreground/70">
                      Источник: {statement.source}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm leading-6",
                        isCorrect ? "text-emerald-800" : "text-red-800"
                      )}
                    >
                      {statement.explanation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setChoices((prev) => {
                        const next = { ...prev };
                        delete next[statement.id];
                        return next;
                      })
                    }
                    className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Изменить вывод
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allAnswered && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Все утверждения разобраны. Верных решений: {correct} из{" "}
            {textAnalysisPractice.statements.length}.
          </p>
          <p className="mt-1 text-sm leading-6 text-emerald-800">
            Теперь сформулируйте собственный список выводов для дополнительной
            проверки и укажите, какой источник или расчёт нужно запросить.
          </p>
        </div>
      )}

      <label className="block">
        <span className="text-sm font-semibold text-foreground">
          Ваш список выводов для дополнительной проверки
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
          Для каждого вывода укажите раздел документа и вопрос, который нужно
          задать.
        </span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={5}
          placeholder={
            "1. Срок хранения архива — п. 2.3 и 5.1: уточнить у владельца регламента.\n2. Экономия 1,2 млн — п. 6.3: запросить методику расчёта..."
          }
          className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
        />
      </label>

      <div>
        <ReferenceButton
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
        />
      </div>

      {revealed && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Краткое содержание
            </p>
            <p className="mt-1 text-sm leading-6 text-emerald-900/85">
              {textAnalysisPractice.reference.summary}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Ключевые положения
            </p>
            <ul className="mt-2 space-y-1.5">
              {textAnalysisPractice.reference.keyPoints.map((item) => (
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
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Обязательства и сроки
            </p>
            <ul className="mt-2 space-y-1.5">
              {textAnalysisPractice.reference.obligations.map((item) => (
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
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Спорные места
            </p>
            <ul className="mt-2 space-y-1.5">
              {textAnalysisPractice.reference.disputes.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Выводы для дополнительной проверки
            </p>
            <ul className="mt-2 space-y-1.5">
              {textAnalysisPractice.reference.verification.map((item) => (
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
      )}
    </div>
  );
}

interface ExtractionCell {
  value: string;
  source: string;
  note: string;
}

const emptyCell: ExtractionCell = { value: "", source: "", note: "" };

export function ExtractTablePractice() {
  const [cells, setCells] = useState<Record<string, ExtractionCell>>({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const rows = extractionPractice.rows;
  const filledRows = rows.filter((row) => {
    const cell = cells[row.id];
    return Boolean(cell?.value.trim() && cell?.source.trim());
  });
  const missingRows = rows.filter(
    (row) => !filledRows.some((filled) => filled.id === row.id)
  );
  const complete = filledRows.length === rows.length;

  const updateCell = (
    id: string,
    field: keyof ExtractionCell,
    value: string
  ) => {
    setCells((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? emptyCell), [field]: value },
    }));
    setChecked(false);
  };

  const reset = () => {
    setCells({});
    setChecked(false);
    setRevealed(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="h-4 w-4 text-[#f36f21]" />
          {extractionPractice.sourceTitle}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {extractionPractice.sourceMeta}
        </p>
        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-lg border border-black/10 bg-white p-4">
          {extractionPractice.sourceParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-6 text-foreground/80">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Заполните значение и источник для каждой строки. Примечание помогает
          зафиксировать ограничение или открытый вопрос.
        </p>
        {(filledRows.length > 0 || checked) && (
          <ResetButton onClick={reset} label="Очистить таблицу" />
        )}
      </div>

      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            Заполнено {filledRows.length} из {rows.length} строк
          </span>
          <span>Пустых или без источника: {missingRows.length}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e8e5df]">
          <div
            className="h-full rounded-full bg-[#f36f21] transition-all"
            style={{
              width: `${Math.round((filledRows.length / rows.length) * 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-[#f3f1ec] text-xs uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Объект</th>
              <th className="px-3 py-2.5 font-semibold">Параметр</th>
              <th className="px-3 py-2.5 font-semibold">Значение</th>
              <th className="px-3 py-2.5 font-semibold">Источник</th>
              <th className="px-3 py-2.5 font-semibold">Примечание</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 bg-white">
            {rows.map((row) => {
              const cell = cells[row.id] ?? emptyCell;

              return (
                <tr key={row.id}>
                  <td className="px-3 py-2.5 align-top text-foreground/85">
                    {row.object}
                  </td>
                  <td className="px-3 py-2.5 align-top text-foreground/85">
                    {row.parameter}
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <input
                      value={cell.value}
                      onChange={(event) =>
                        updateCell(row.id, "value", event.target.value)
                      }
                      placeholder="Значение"
                      className="w-44 rounded-md border border-black/15 bg-white px-2 py-1.5 text-sm text-foreground outline-none focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                    />
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <input
                      value={cell.source}
                      onChange={(event) =>
                        updateCell(row.id, "source", event.target.value)
                      }
                      placeholder="Пункт источника"
                      className="w-36 rounded-md border border-black/15 bg-white px-2 py-1.5 text-sm text-foreground outline-none focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                    />
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <input
                      value={cell.note}
                      onChange={(event) =>
                        updateCell(row.id, "note", event.target.value)
                      }
                      placeholder="Необязательно"
                      className="w-48 rounded-md border border-black/15 bg-white px-2 py-1.5 text-sm text-foreground outline-none focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => setChecked(true)}
          className="h-9 bg-[#f36f21] text-white hover:bg-[#d95c16]"
        >
          <ClipboardCheck className="h-4 w-4" />
          Проверить полноту
        </Button>
        <ReferenceButton
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
        />
      </div>

      {checked && (
        <div
          className={cn(
            "rounded-lg border p-3.5",
            complete
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          <p
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              complete ? "text-emerald-900" : "text-amber-900"
            )}
          >
            {complete ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {complete
              ? "Все строки заполнены, у каждой есть источник."
              : `Заполнено ${filledRows.length} из ${rows.length} строк. Проверьте пропуски.`}
          </p>
          {!complete && (
            <ul className="mt-2 space-y-1.5">
              {missingRows.map((row) => {
                const cell = cells[row.id] ?? emptyCell;
                const missingFields: string[] = [];
                if (!cell.value.trim()) {
                  missingFields.push("значение");
                }
                if (!cell.source.trim()) {
                  missingFields.push("источник");
                }

                return (
                  <li
                    key={row.id}
                    className="text-sm leading-6 text-amber-900/85"
                  >
                    <span className="font-semibold">
                      {row.object} — {row.parameter}:
                    </span>{" "}
                    не заполнено {missingFields.join(" и ")}.
                  </li>
                );
              })}
            </ul>
          )}
          {complete && (
            <p className="mt-1 text-sm leading-6 text-emerald-800">
              Полнота проверена по строкам. Теперь сверьте точность значений и
              отметьте параметры, которые в источнике не указаны.
            </p>
          )}
        </div>
      )}

      {revealed && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Эталонная таблица
            </p>
            <ul className="mt-2 space-y-1.5">
              {extractionPractice.referenceRows.map((item) => (
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
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Проверка полноты
            </p>
            <ul className="mt-2 space-y-1.5">
              {extractionPractice.completenessNotes.map((item) => (
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
      )}
    </div>
  );
}

export function SpreadsheetAuditPractice() {
  const [answers, setAnswers] = useState<Record<string, SpreadsheetIssue>>({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [cleanup, setCleanup] = useState("");
  const [summary, setSummary] = useState("");

  const rows = spreadsheetAuditPractice.rows;
  const answered = Object.keys(answers).length;
  const correct = rows.filter(
    (row) => answers[row.id] === row.correctIssue
  ).length;

  const setAnswer = (id: string, value: SpreadsheetIssue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setChecked(false);
  };

  const reset = () => {
    setAnswers({});
    setChecked(false);
    setRevealed(false);
    setCleanup("");
    setSummary("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="h-4 w-4 text-[#f36f21]" />
          {spreadsheetAuditPractice.title}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {spreadsheetAuditPractice.intro}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Для каждой строки выберите тип проблемы. Если строка корректна,
          выберите «Нет ошибки».
        </p>
        {answered > 0 && (
          <ResetButton onClick={reset} label="Сбросить ответы" />
        )}
      </div>

      <ScoreLine answered={answered} total={rows.length} correct={correct} />

      <div className="overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
          <thead className="bg-[#f3f1ec] text-xs uppercase tracking-[0.08em] text-muted-foreground">
            <tr>
              {spreadsheetAuditPractice.columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-3 py-2.5 font-semibold"
                >
                  {column}
                </th>
              ))}
              <th className="px-3 py-2.5 font-semibold">Тип ошибки</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 bg-white">
            {rows.map((row) => {
              const answer = answers[row.id];
              const isCorrect = answer === row.correctIssue;
              const highlight = checked
                ? isCorrect
                  ? "bg-emerald-50/60"
                  : "bg-red-50/60"
                : "bg-white";

              return (
                <tr key={row.id} className={highlight}>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {row.number}
                  </td>
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2.5 text-foreground/85",
                      row.correctIssue === "date" &&
                        "font-medium text-[#c8560f]"
                    )}
                  >
                    {row.date || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {row.department || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-foreground/85">{row.item}</td>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {row.quantity}
                  </td>
                  <td className="px-3 py-2.5 text-foreground/85">{row.unit}</td>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {row.price || "—"}
                  </td>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {row.total}
                  </td>
                  <td className="px-3 py-2.5 text-foreground/75">
                    {row.comment || "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <select
                      value={answer ?? ""}
                      onChange={(event) =>
                        setAnswer(
                          row.id,
                          event.target.value as SpreadsheetIssue
                        )
                      }
                      className="w-40 rounded-md border border-black/15 bg-white px-2 py-1.5 text-sm text-foreground outline-none focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                    >
                      <option value="">Не выбрано</option>
                      {spreadsheetAuditPractice.issueTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Типы ошибок
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {spreadsheetAuditPractice.issueTypes.map((type) => (
            <li
              key={type.id}
              className="text-xs leading-5 text-muted-foreground"
            >
              <span className="font-semibold text-foreground">
                {type.label}:
              </span>{" "}
              {type.hint}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => setChecked(true)}
          className="h-9 bg-[#f36f21] text-white hover:bg-[#d95c16]"
        >
          <ClipboardCheck className="h-4 w-4" />
          Проверить ответы
        </Button>
        <ReferenceButton
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
        />
      </div>

      {checked && (
        <div
          className={cn(
            "rounded-lg border p-3.5",
            correct === rows.length
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          <p
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              correct === rows.length ? "text-emerald-900" : "text-amber-900"
            )}
          >
            {correct === rows.length ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {correct === rows.length
              ? "Все строки классифицированы верно."
              : `Верно ${correct} из ${rows.length}. Проверьте подсвеченные строки.`}
          </p>
          <ul className="mt-2 space-y-2">
            {rows.map((row) => {
              const answer = answers[row.id];
              if (answer === row.correctIssue) {
                return null;
              }
              const selected = spreadsheetAuditPractice.issueTypes.find(
                (type) => type.id === answer
              );
              const expected = spreadsheetAuditPractice.issueTypes.find(
                (type) => type.id === row.correctIssue
              );

              return (
                <li
                  key={row.id}
                  className="text-sm leading-6 text-amber-900/85"
                >
                  <span className="font-semibold">Строка {row.number}:</span>{" "}
                  выбрано «{selected?.label ?? "нет ответа"}», верно — «
                  {expected?.label}». {row.explanation}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Порядок очистки
          </span>
          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
            Опишите шаги: что проверить первым, что исправить и как сверить
            итог.
          </span>
          <textarea
            value={cleanup}
            onChange={(event) => setCleanup(event.target.value)}
            rows={5}
            placeholder="1. Сохранить копию исходника…"
            className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Краткая аналитическая сводка
          </span>
          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
            Укажите, сколько строк проблемных, какие ошибки преобладают и что
            это значит для выводов.
          </span>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={5}
            placeholder="В реестре 13 строк, из них…"
            className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
          />
        </label>
      </div>

      {revealed && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Список ошибок
            </p>
            <ul className="mt-2 space-y-1.5">
              {spreadsheetAuditPractice.reference.errors.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Порядок очистки
            </p>
            <ol className="mt-2 space-y-1.5">
              {spreadsheetAuditPractice.reference.cleanup.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Краткая аналитическая сводка
            </p>
            <ul className="mt-2 space-y-1.5">
              {spreadsheetAuditPractice.reference.summary.map((item) => (
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
      )}
    </div>
  );
}

const reasoningStyles: Record<ReasoningCategory, string> = {
  fact: "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
  calculation: "border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100",
  interpretation:
    "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
  hypothesis:
    "border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100",
  recommendation:
    "border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100",
};

export function IndicatorConclusionsPractice() {
  const [choices, setChoices] = useState<Record<string, ReasoningCategory>>({});
  const [dataNotes, setDataNotes] = useState("");
  const [revealed, setRevealed] = useState(false);

  const statements = indicatorPractice.statements;
  const answered = Object.keys(choices).length;
  const correct = statements.filter(
    (statement) => choices[statement.id] === statement.correct
  ).length;

  const reset = () => {
    setChoices({});
    setDataNotes("");
    setRevealed(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="h-4 w-4 text-[#f36f21]" />
          {indicatorPractice.title}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {indicatorPractice.periodNote}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {indicatorPractice.intro}
        </p>

        <div className="mt-3 overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-[#f3f1ec] text-xs uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Показатель</th>
                <th className="px-3 py-2.5 font-semibold">Март</th>
                <th className="px-3 py-2.5 font-semibold">Апрель</th>
                <th className="px-3 py-2.5 font-semibold">Отклонение</th>
                <th className="px-3 py-2.5 font-semibold">К прошлому периоду</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {indicatorPractice.metrics.map((metric) => (
                <tr key={metric.id}>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {metric.name}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {metric.unit}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {metric.march}
                  </td>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {metric.april}
                  </td>
                  <td className="px-3 py-2.5 text-foreground/85">
                    {metric.change}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-foreground">
                    {metric.changePercent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Для каждого утверждения выберите уровень: факт, расчёт,
          интерпретация, гипотеза или рекомендация. После выбора появится
          объяснение.
        </p>
        {answered > 0 && (
          <ResetButton onClick={reset} label="Сбросить ответы" />
        )}
      </div>

      <ScoreLine answered={answered} total={statements.length} correct={correct} />

      <div className="rounded-lg border border-black/10 bg-white p-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Пять уровней утверждения
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {indicatorPractice.categories.map((category) => (
            <li
              key={category.id}
              className="text-xs leading-5 text-muted-foreground"
            >
              <span className="font-semibold text-foreground">
                {category.label}:
              </span>{" "}
              {category.hint}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {statements.map((statement, index) => {
          const choice = choices[statement.id];
          const isAnswered = choice !== undefined;
          const isCorrect = choice === statement.correct;
          const correctCategory = indicatorPractice.categories.find(
            (category) => category.id === statement.correct
          );

          return (
            <div
              key={statement.id}
              className="rounded-xl border border-black/10 bg-white p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Утверждение {index + 1}
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {statement.text}
              </p>

              {!isAnswered ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {indicatorPractice.categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        setChoices((prev) => ({
                          ...prev,
                          [statement.id]: category.id,
                        }))
                      }
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors",
                        reasoningStyles[category.id]
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <div
                    className={cn(
                      "rounded-lg border p-3.5",
                      isCorrect
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                    )}
                  >
                    <p
                      className={cn(
                        "flex items-center gap-2 text-sm font-semibold",
                        isCorrect ? "text-emerald-900" : "text-red-900"
                      )}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {isCorrect
                        ? "Верно"
                        : `Неверно. Это ${correctCategory?.label.toLowerCase()}`}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-sm leading-6",
                        isCorrect ? "text-emerald-800" : "text-red-900/85"
                      )}
                    >
                      {statement.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <label className="block rounded-xl border border-black/10 bg-white p-4">
        <span className="text-sm font-semibold text-foreground">
          Какие данные нужны для проверки причин?
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
          Опишите источники и срезы, которые позволят проверить гипотезы, а не
          подтвердить удобную версию.
        </span>
        <textarea
          value={dataNotes}
          onChange={(event) => setDataNotes(event.target.value)}
          rows={4}
          placeholder="Например: структура продаж по категориям, причины возвратов, календарь скидок…"
          className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <ReferenceButton
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
        />
      </div>

      {revealed && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Три вывода с разделением уровней
            </p>
            <ul className="mt-2 space-y-1.5">
              {indicatorPractice.reference.conclusions.map((item) => (
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Подтверждённые факты
              </p>
              <ul className="mt-2 space-y-1.5">
                {indicatorPractice.reference.facts.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Гипотезы, требующие проверки
              </p>
              <ul className="mt-2 space-y-1.5">
                {indicatorPractice.reference.hypotheses.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Данные для проверки причин
            </p>
            <ul className="mt-2 space-y-1.5">
              {indicatorPractice.reference.dataToVerify.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                >
                  <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
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

const sourceStyles: Record<SourceVerdict, string> = {
  confirmed:
    "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
  unsuitable: "border-red-200 bg-red-50 text-red-900 hover:bg-red-100",
  outdated: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
  verify: "border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100",
};

export function SourceVerificationPractice() {
  const [choices, setChoices] = useState<Record<string, SourceVerdict>>({});
  const [revealed, setRevealed] = useState(false);

  const claims = sourceVerificationPractice.claims;
  const answered = Object.keys(choices).length;
  const correct = claims.filter(
    (claim) => choices[claim.id] === claim.correct
  ).length;

  const reset = () => {
    setChoices({});
    setRevealed(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileSearch className="h-4 w-4 text-[#f36f21]" />
          {sourceVerificationPractice.title}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {sourceVerificationPractice.intro}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Для каждого утверждения оцените источник и актуальность сведений.
        </p>
        {answered > 0 && (
          <ResetButton onClick={reset} label="Сбросить ответы" />
        )}
      </div>

      <ScoreLine answered={answered} total={claims.length} correct={correct} />

      <div className="rounded-lg border border-black/10 bg-white p-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Как различать варианты
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {sourceVerificationPractice.categories.map((category) => (
            <li
              key={category.id}
              className="text-xs leading-5 text-muted-foreground"
            >
              <span className="font-semibold text-foreground">
                {category.label}:
              </span>{" "}
              {category.hint}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {claims.map((claim, index) => {
          const choice = choices[claim.id];
          const isAnswered = choice !== undefined;
          const isCorrect = choice === claim.correct;
          const correctCategory = sourceVerificationPractice.categories.find(
            (category) => category.id === claim.correct
          );

          return (
            <div
              key={claim.id}
              className="rounded-xl border border-black/10 bg-white p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Утверждение {index + 1}
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                {claim.claim}
              </p>
              <div className="mt-2 rounded-lg border border-black/10 bg-[#f9f8f5] px-3 py-2.5">
                <p className="text-xs font-semibold text-foreground">
                  {claim.sourceTitle}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {claim.sourceMeta}
                </p>
              </div>

              {!isAnswered ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {sourceVerificationPractice.categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        setChoices((prev) => ({
                          ...prev,
                          [claim.id]: category.id,
                        }))
                      }
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors",
                        sourceStyles[category.id]
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "mt-3 rounded-lg border p-3.5",
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  <p
                    className={cn(
                      "flex items-center gap-2 text-sm font-semibold",
                      isCorrect ? "text-emerald-900" : "text-red-900"
                    )}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {isCorrect
                      ? "Верно"
                      : `Неверно. Правильный вариант — «${correctCategory?.label}»`}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm leading-6",
                      isCorrect ? "text-emerald-800" : "text-red-900/85"
                    )}
                  >
                    {claim.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ReferenceButton
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
        />
      </div>

      {revealed && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Подтверждено
              </p>
              <ul className="mt-2 space-y-1.5">
                {sourceVerificationPractice.reference.confirmed.map((item) => (
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
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Неподходящие источники
              </p>
              <ul className="mt-2 space-y-1.5">
                {sourceVerificationPractice.reference.unsuitable.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                  >
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-900">Устарело</p>
              <ul className="mt-2 space-y-1.5">
                {sourceVerificationPractice.reference.outdated.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Нужно проверить дополнительно
              </p>
              <ul className="mt-2 space-y-1.5">
                {sourceVerificationPractice.reference.verify.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                  >
                    <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Правила проверки источников
            </p>
            <ul className="mt-2 space-y-1.5">
              {sourceVerificationPractice.reference.rules.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                >
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
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

export function AnalyticalReviewPractice() {
  const [answers, setAnswers] = useState<Record<string, ReviewErrorType>>({});
  const [checked, setChecked] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  const [dataNeeded, setDataNeeded] = useState("");
  const [revealed, setRevealed] = useState(false);

  const findings = analyticalReviewPractice.findings;
  const answered = Object.keys(answers).length;
  const correct = findings.filter(
    (finding) => answers[finding.id] === finding.correct
  ).length;

  const setAnswer = (id: string, value: ReviewErrorType) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setChecked(false);
  };

  const reset = () => {
    setAnswers({});
    setChecked(false);
    setInterpretation("");
    setDataNeeded("");
    setRevealed(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="h-4 w-4 text-[#f36f21]" />
          {analyticalReviewPractice.memoTitle}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {analyticalReviewPractice.memoMeta}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {analyticalReviewPractice.memoIntro}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Для каждого фрагмента выберите тип ошибки, затем проверьте ответы.
        </p>
        {(answered > 0 || checked) && (
          <ResetButton onClick={reset} label="Сбросить разбор" />
        )}
      </div>

      <ScoreLine answered={answered} total={findings.length} correct={correct} />

      <div className="rounded-lg border border-black/10 bg-white p-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Типы ошибок
        </p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {analyticalReviewPractice.errorTypes.map((type) => (
            <li
              key={type.id}
              className="text-xs leading-5 text-muted-foreground"
            >
              <span className="font-semibold text-foreground">
                {type.label}:
              </span>{" "}
              {type.hint}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {findings.map((finding, index) => {
          const answer = answers[finding.id];
          const isAnswered = answer !== undefined;
          const isCorrect = answer === finding.correct;
          const correctType = analyticalReviewPractice.errorTypes.find(
            (type) => type.id === finding.correct
          );

          return (
            <div
              key={finding.id}
              className={cn(
                "rounded-xl border bg-white p-4",
                checked
                  ? isCorrect
                    ? "border-emerald-200"
                    : "border-red-200"
                  : "border-black/10"
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Фрагмент {index + 1}
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                «{finding.fragment}»
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={answer ?? ""}
                  onChange={(event) =>
                    setAnswer(finding.id, event.target.value as ReviewErrorType)
                  }
                  className="w-full max-w-sm rounded-md border border-black/15 bg-white px-2.5 py-2 text-sm text-foreground outline-none focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
                >
                  <option value="">Выберите тип ошибки</option>
                  {analyticalReviewPractice.errorTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {checked && isAnswered && (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isCorrect ? "text-emerald-700" : "text-red-700"
                    )}
                  >
                    {isCorrect ? "Верно" : `Верно: ${correctType?.label}`}
                  </span>
                )}
              </div>

              {checked && (
                <div
                  className={cn(
                    "mt-3 rounded-lg border p-3.5",
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  )}
                >
                  <p className="text-sm leading-6 text-foreground/85">
                    {finding.explanation}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-900">
                    <span className="font-semibold">
                      Корректная интерпретация:
                    </span>{" "}
                    {finding.correctInterpretation}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Какие данные нужны:
                    </span>{" "}
                    {finding.dataNeeded}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block rounded-xl border border-black/10 bg-white p-4">
          <span className="text-sm font-semibold text-foreground">
            Ваша корректная интерпретация
          </span>
          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
            Переформулируйте вывод без логической ошибки и с явным ограничением.
          </span>
          <textarea
            value={interpretation}
            onChange={(event) => setInterpretation(event.target.value)}
            rows={4}
            placeholder="Например: рост продаж после рассылки — возможная причина, требуется контрольная группа…"
            className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
          />
        </label>
        <label className="block rounded-xl border border-black/10 bg-white p-4">
          <span className="text-sm font-semibold text-foreground">
            Какие данные нужны
          </span>
          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
            Назовите источники, срезы и период, которые позволят проверить вывод.
          </span>
          <textarea
            value={dataNeeded}
            onChange={(event) => setDataNeeded(event.target.value)}
            rows={4}
            placeholder="Например: контрольная группа, календарь акций, абсолютные значения затрат…"
            className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => setChecked(true)}
          className="h-9 bg-[#f36f21] text-white hover:bg-[#d95c16]"
        >
          <ClipboardCheck className="h-4 w-4" />
          Проверить ошибки
        </Button>
        <ReferenceButton
          open={revealed}
          onToggle={() => setRevealed((prev) => !prev)}
        />
      </div>

      {checked && (
        <div
          className={cn(
            "rounded-lg border p-3.5",
            correct === findings.length
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          <p
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              correct === findings.length
                ? "text-emerald-900"
                : "text-amber-900"
            )}
          >
            {correct === findings.length ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {correct === findings.length
              ? "Все типы ошибок определены верно."
              : `Верно ${correct} из ${findings.length}. Разберите пояснения к фрагментам.`}
          </p>
          <p className="mt-1 text-sm leading-6 text-amber-900/85">
            Теперь сверьте свою интерпретацию и список данных с эталоном: важно
            не только назвать ошибку, но и показать, как её исправить.
          </p>
        </div>
      )}

      {revealed && (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Корректные формулировки
            </p>
            <ul className="mt-2 space-y-1.5">
              {analyticalReviewPractice.reference.corrected.map((item) => (
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
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Какие данные нужны
            </p>
            <ul className="mt-2 space-y-1.5">
              {analyticalReviewPractice.reference.dataNeeded.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-6 text-emerald-900/85"
                >
                  <FileSearch className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
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
