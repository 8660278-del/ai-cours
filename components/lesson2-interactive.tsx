"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  RotateCcw,
  ShieldQuestion,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  documentPractice,
  letterPractice,
  type DataSafetyQuestion,
} from "@/lib/module2-interactive-data";

function DataSafety({ question }: { question: DataSafetyQuestion }) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedOption = question.options.find(
    (option) => option.id === selected
  );

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ShieldQuestion className="h-4 w-4 text-[#f36f21]" />
        Вопрос о допустимости передачи данных
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground/80">
        {question.question}
      </p>

      <div className="mt-3 space-y-2">
        {question.options.map((option) => {
          const active = selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className={cn(
                "w-full rounded-lg border px-3.5 py-2.5 text-left text-sm leading-6 transition-colors",
                active
                  ? "border-[#f36f21] bg-[#fff7f1] text-foreground"
                  : "border-black/15 bg-[#fbfaf7] text-foreground/80 hover:border-black/30"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div
          className={cn(
            "mt-3 flex items-start gap-2.5 rounded-lg border p-3.5",
            selectedOption.correct
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          )}
        >
          {selectedOption.correct ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          )}
          <div>
            <p
              className={cn(
                "text-sm font-semibold",
                selectedOption.correct ? "text-emerald-900" : "text-red-900"
              )}
            >
              {selectedOption.correct
                ? "Верное решение"
                : "Недопустимое решение"}
            </p>
            <p
              className={cn(
                "mt-1 text-sm leading-6",
                selectedOption.correct ? "text-emerald-800" : "text-red-800"
              )}
            >
              {selectedOption.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface SelfChecksProps {
  id: string;
  checks: string[];
  state: Record<string, boolean>;
  onToggle: (key: string) => void;
}

function SelfChecks({ id, checks, state, onToggle }: SelfChecksProps) {
  return (
    <div className="mt-3 rounded-lg border border-black/10 bg-[#f9f8f5] p-3.5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Самопроверка тона и точности
      </p>
      <div className="mt-2.5 space-y-2">
        {checks.map((check, index) => {
          const key = `${id}:${index}`;
          const checked = Boolean(state[key]);

          return (
            <label
              key={key}
              className="flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-foreground/80"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(key)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#f36f21]"
              />
              <span>{check}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ReferenceBlock({
  open,
  onToggle,
  title,
  text,
  notes,
}: {
  open: boolean;
  onToggle: () => void;
  title: string;
  text: string;
  notes: string[];
}) {
  return (
    <div className="mt-3">
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
        <div className="mt-3 space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5">
          <p className="text-sm font-semibold text-emerald-900">{title}</p>
          <pre className="whitespace-pre-wrap break-words rounded-lg border border-emerald-200 bg-white p-3 font-sans text-sm leading-6 text-foreground/85">
            {text}
          </pre>
          <ul className="space-y-1.5">
            {notes.map((note) => (
              <li
                key={note}
                className="flex gap-2 text-sm leading-6 text-emerald-800"
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

function PracticeHeader({
  filled,
  total,
  checked,
  totalChecks,
  onReset,
}: {
  filled: number;
  total: number;
  checked: number;
  totalChecks: number;
  onReset: () => void;
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-[#f9f8f5] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Черновики: {filled} из {total}
        </span>
        <span>
          Отмечено критериев: {checked} из {totalChecks}
        </span>
        {(filled > 0 || checked > 0) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-7 border-black/15 bg-white text-foreground hover:bg-[#f3f1ec]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Сбросить
          </Button>
        )}
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e8e5df]">
        <div
          className="h-full rounded-full bg-[#f36f21] transition-all"
          style={{ width: `${Math.round((filled / total) * 100)}%` }}
        />
      </div>
    </div>
  );
}

export function LetterPractice() {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const totalChecks = letterPractice.scenarios.reduce(
    (sum, scenario) => sum + scenario.checks.length,
    0
  );
  const filled = letterPractice.scenarios.filter(
    (scenario) => (drafts[scenario.id] ?? "").trim().length > 0
  ).length;
  const checked = Object.values(checks).filter(Boolean).length;

  const toggleCheck = (key: string) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = () => {
    setDrafts({});
    setChecks({});
    setRevealed({});
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="h-4 w-4 text-[#f36f21]" />
          {letterPractice.situationTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground/80">
          {letterPractice.situation}
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Подтверждённые факты
        </p>
        <ul className="mt-2 space-y-1.5">
          {letterPractice.facts.map((fact) => (
            <li
              key={fact}
              className="flex gap-2 text-sm leading-6 text-foreground/80"
            >
              <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f36f21]"
                aria-hidden="true"
              />
              {fact}
            </li>
          ))}
        </ul>
      </div>

      <DataSafety question={letterPractice.safety} />

      <PracticeHeader
        filled={filled}
        total={letterPractice.scenarios.length}
        checked={checked}
        totalChecks={totalChecks}
        onReset={reset}
      />

      {letterPractice.scenarios.map((scenario) => (
        <div
          key={scenario.id}
          className="rounded-xl border border-black/10 bg-white p-4 sm:p-5"
        >
          <p className="text-sm font-semibold text-foreground">
            {scenario.title}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Адресат: {scenario.addressee}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            {scenario.purpose}
          </p>

          <ul className="mt-3 space-y-1.5">
            {scenario.hints.map((hint) => (
              <li
                key={hint}
                className="flex gap-2 text-xs leading-5 text-muted-foreground"
              >
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-black/30"
                  aria-hidden="true"
                />
                {hint}
              </li>
            ))}
          </ul>

          <label className="mt-3 block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Ваш черновик
            </span>
            <textarea
              value={drafts[scenario.id] ?? ""}
              onChange={(event) =>
                setDrafts((prev) => ({
                  ...prev,
                  [scenario.id]: event.target.value,
                }))
              }
              rows={7}
              placeholder={scenario.placeholder}
              className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
            />
          </label>

          <SelfChecks
            id={scenario.id}
            checks={scenario.checks}
            state={checks}
            onToggle={toggleCheck}
          />

          <ReferenceBlock
            open={Boolean(revealed[scenario.id])}
            onToggle={() =>
              setRevealed((prev) => ({
                ...prev,
                [scenario.id]: !prev[scenario.id],
              }))
            }
            title="Эталон письма"
            text={scenario.reference}
            notes={scenario.referenceNotes}
          />
        </div>
      ))}

      {filled === letterPractice.scenarios.length && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-6 text-emerald-900">
            Все четыре черновика подготовлены. Теперь проверьте каждый по
            критериям самопроверки и сверьте с эталоном: нет ли лишних обещаний,
            неточных дат и неподтверждённых условий.
          </p>
        </div>
      )}
    </div>
  );
}

export function DocumentPractice() {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const totalChecks = documentPractice.outputs.reduce(
    (sum, output) => sum + output.checks.length,
    0
  );
  const filled = documentPractice.outputs.filter(
    (output) => (drafts[output.id] ?? "").trim().length > 0
  ).length;
  const checked = Object.values(checks).filter(Boolean).length;

  const toggleCheck = (key: string) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = () => {
    setDrafts({});
    setChecks({});
    setRevealed({});
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-[#f9f8f5] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <ClipboardList className="h-4 w-4 text-[#f36f21]" />
          {documentPractice.sourceTitle}
        </p>
        <p className="mt-2 rounded-lg border border-black/10 bg-white p-3.5 text-sm leading-6 text-foreground/85">
          {documentPractice.source}
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {documentPractice.sourceNote}
        </p>
      </div>

      <DataSafety question={documentPractice.safety} />

      <PracticeHeader
        filled={filled}
        total={documentPractice.outputs.length}
        checked={checked}
        totalChecks={totalChecks}
        onReset={reset}
      />

      {documentPractice.outputs.map((output) => (
        <div
          key={output.id}
          className="rounded-xl border border-black/10 bg-white p-4 sm:p-5"
        >
          <p className="text-sm font-semibold text-foreground">
            {output.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground/80">
            {output.goal}
          </p>
          <p className="mt-2 rounded-lg border border-black/10 bg-[#fbfaf7] px-3 py-2 text-xs leading-5 text-muted-foreground">
            Формат: {output.formatHint}
          </p>

          <label className="mt-3 block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Ваш документ
            </span>
            <textarea
              value={drafts[output.id] ?? ""}
              onChange={(event) =>
                setDrafts((prev) => ({
                  ...prev,
                  [output.id]: event.target.value,
                }))
              }
              rows={8}
              placeholder={output.placeholder}
              className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20"
            />
          </label>

          <SelfChecks
            id={output.id}
            checks={output.checks}
            state={checks}
            onToggle={toggleCheck}
          />

          <ReferenceBlock
            open={Boolean(revealed[output.id])}
            onToggle={() =>
              setRevealed((prev) => ({
                ...prev,
                [output.id]: !prev[output.id],
              }))
            }
            title="Эталон документа"
            text={output.reference}
            notes={output.referenceNotes}
          />
        </div>
      ))}

      {filled === documentPractice.outputs.length && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-6 text-emerald-900">
            Все три документа подготовлены. Проверьте, что факты и сроки не
            изменились при смене формата, а открытый вопрос по подрядчикам и
            риск с фотографиями остались в записке и резюме.
          </p>
        </div>
      )}
    </div>
  );
}
