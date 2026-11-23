"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bookmark,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  Lightbulb,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PersonalPrompt } from "@/lib/models";
import {
  aiFitLabels,
  aiRoleLabels,
  approvalLabels,
  processDecompositionExample,
  processStageFields,
  taskDiscoveryExamples,
  taskDiscoveryFields,
  templateExample,
  templateFields,
  type AiFit,
  type AiRole,
  type Approval,
} from "@/lib/module5-interactive-data";

function ResetButton({
  onClick,
  label = "Очистить",
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

function FieldLabel({ label, hint }: { label: string; hint: string }) {
  return (
    <>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
        {hint}
      </span>
    </>
  );
}

const inputClassName =
  "mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20";

const selectClassName =
  "mt-2 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[#f36f21] focus:ring-2 focus:ring-[#f36f21]/20";

interface TaskDraft {
  id: string;
  title: string;
  frequency: string;
  time: string;
  inputData: string;
  result: string;
  aiFit: AiFit | "";
  risks: string;
}

function createEmptyTask(index: number): TaskDraft {
  return {
    id: `task-draft-${index + 1}`,
    title: "",
    frequency: "",
    time: "",
    inputData: "",
    result: "",
    aiFit: "",
    risks: "",
  };
}

function createEmptyTasks(): TaskDraft[] {
  return Array.from({ length: 5 }, (_, index) => createEmptyTask(index));
}

function isTaskComplete(task: TaskDraft): boolean {
  return (
    task.title.trim().length > 0 &&
    task.frequency.trim().length > 0 &&
    task.time.trim().length > 0 &&
    task.inputData.trim().length > 0 &&
    task.result.trim().length > 0 &&
    task.aiFit !== "" &&
    task.risks.trim().length > 0
  );
}

function missingTaskFields(task: TaskDraft): string[] {
  const missing: string[] = [];

  taskDiscoveryFields.forEach((field) => {
    if (task[field.key].trim().length === 0) {
      missing.push(field.label.toLowerCase());
    }
  });

  if (task.aiFit === "") {
    missing.push("применимость ИИ");
  }

  return missing;
}

export function TaskDiscoveryPractice() {
  const [tasks, setTasks] = useState<TaskDraft[]>(createEmptyTasks);
  const [checked, setChecked] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const completed = tasks.filter(isTaskComplete).length;
  const allFilled = completed === tasks.length;
  const hasLimitedTask = tasks.some(
    (task) => task.aiFit === "partial" || task.aiFit === "no"
  );
  const ready = allFilled && hasLimitedTask;

  const updateTask = (
    id: string,
    key: keyof Omit<TaskDraft, "id">,
    value: string
  ) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [key]: value } : task))
    );
  };

  const fillExample = () => {
    setTasks(
      taskDiscoveryExamples.map((example, index) => ({
        id: `task-example-${index + 1}`,
        title: example.title,
        frequency: example.frequency,
        time: example.time,
        inputData: example.inputData,
        result: example.result,
        aiFit: example.aiFit,
        risks: example.risks,
      }))
    );
    setChecked(false);
  };

  const reset = () => {
    setTasks(createEmptyTasks());
    setChecked(false);
    setReferenceOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Заполните пять карточек. Примеры из разных направлений доступны в
          эталоне и кнопкой «Заполнить примером».
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillExample}
            className="h-9 border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
          >
            <Sparkles className="h-4 w-4" />
            Заполнить примером
          </Button>
          <ResetButton onClick={reset} />
        </div>
      </div>

      <ProgressLine
        answered={completed}
        total={tasks.length}
        extra="нужно 5 задач"
      />

      <div className="space-y-3">
        {tasks.map((task, index) => {
          const complete = isTaskComplete(task);
          const missing = missingTaskFields(task);

          return (
            <div
              key={task.id}
              className={cn(
                "rounded-xl border bg-white p-4 sm:p-5",
                checked && complete
                  ? "border-emerald-200"
                  : checked
                    ? "border-amber-200"
                    : "border-black/10"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Задача {index + 1}
                </p>
                {checked &&
                  (complete ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      заполнено
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      не хватает: {missing.join(", ")}
                    </span>
                  ))}
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {taskDiscoveryFields.map((field) => (
                  <label
                    key={field.key}
                    className={cn(
                      "block",
                      field.key === "title" || field.key === "risks"
                        ? "sm:col-span-2"
                        : ""
                    )}
                  >
                    <FieldLabel label={field.label} hint={field.hint} />
                    <textarea
                      value={task[field.key]}
                      onChange={(event) =>
                        updateTask(task.id, field.key, event.target.value)
                      }
                      placeholder={field.placeholder}
                      rows={field.rows}
                      className={inputClassName}
                    />
                  </label>
                ))}

                <label className="block sm:col-span-2">
                  <FieldLabel
                    label="Применимость ИИ"
                    hint="Выберите роль ИИ и оставьте решение за человеком там, где ошибка дорога."
                  />
                  <select
                    value={task.aiFit}
                    onChange={(event) =>
                      updateTask(task.id, "aiFit", event.target.value)
                    }
                    className={selectClassName}
                  >
                    <option value="">Выберите вариант</option>
                    {(Object.keys(aiFitLabels) as AiFit[]).map((value) => (
                      <option key={value} value={value}>
                        {aiFitLabels[value]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => setChecked(true)}
          className="bg-[#171717] text-white hover:bg-black"
        >
          <ClipboardList className="h-4 w-4" />
          Проверить карточки
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setReferenceOpen((prev) => !prev)}
          className="h-9 border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
        >
          <Lightbulb className="h-4 w-4 text-emerald-600" />
          {referenceOpen ? "Скрыть эталон" : "Показать эталон"}
        </Button>
      </div>

      {checked && (
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-lg border p-4",
            ready
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          {ready ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          )}
          <p
            className={cn(
              "text-sm leading-6",
              ready ? "text-emerald-900" : "text-amber-900"
            )}
          >
            {ready
              ? "Все пять карточек заполнены, и в списке есть задачи с ограничениями. Теперь можно переходить к декомпозиции процесса."
              : allFilled
                ? "Карточки заполнены, но все задачи отмечены как «ИИ подходит». Добавьте хотя бы одну задачу, где ИИ помогает частично или не подходит: риск — часть оценки."
                : `Заполнено ${completed} из ${tasks.length}. Дополните карточки: у каждой задачи должны быть частота, время, вход, результат, применимость ИИ и риски.`}
          </p>
        </div>
      )}

      {referenceOpen && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Эталон: пять задач из разных направлений
          </p>
          <ul className="mt-3 space-y-3">
            {taskDiscoveryExamples.map((example) => (
              <li
                key={example.title}
                className="rounded-lg border border-emerald-200/70 bg-white p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                  {example.direction}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {example.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {example.frequency} · {example.time} ·{" "}
                  {aiFitLabels[example.aiFit]}
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-900/85">
                  Риски: {example.risks}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface StageDraft {
  id: string;
  title: string;
  input: string;
  action: string;
  result: string;
  aiRole: AiRole | "";
  humanControl: string;
  approval: Approval;
  exceptions: string;
}

function createEmptyStage(index: number): StageDraft {
  return {
    id: `stage-draft-${index + 1}`,
    title: "",
    input: "",
    action: "",
    result: "",
    aiRole: "",
    humanControl: "",
    approval: "none",
    exceptions: "",
  };
}

function createEmptyStages(): StageDraft[] {
  return Array.from({ length: 5 }, (_, index) => createEmptyStage(index));
}

function isStageComplete(stage: StageDraft): boolean {
  return (
    stage.title.trim().length > 0 &&
    stage.input.trim().length > 0 &&
    stage.action.trim().length > 0 &&
    stage.result.trim().length > 0 &&
    stage.aiRole !== "" &&
    stage.humanControl.trim().length > 0 &&
    stage.exceptions.trim().length > 0
  );
}

const MIN_STAGES = 4;
const MAX_STAGES = 8;

function missingStageFields(stage: StageDraft): string[] {
  const missing: string[] = [];

  processStageFields.forEach((field) => {
    if (stage[field.key].trim().length === 0) {
      missing.push(field.label.toLowerCase());
    }
  });

  if (stage.aiRole === "") {
    missing.push("роль ИИ");
  }

  return missing;
}

export function ProcessDecompositionPractice() {
  const [operation, setOperation] = useState("");
  const [context, setContext] = useState("");
  const [stages, setStages] = useState<StageDraft[]>(createEmptyStages);
  const [checked, setChecked] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const completedStages = stages.filter(isStageComplete).length;
  const hasApproval = stages.some((stage) => stage.approval === "required");
  const hasHumanOnly = stages.some((stage) => stage.aiRole === "human");
  const allStagesFilled = completedStages === stages.length;
  const ready =
    operation.trim().length > 0 &&
    stages.length >= MIN_STAGES &&
    allStagesFilled &&
    hasApproval &&
    hasHumanOnly;

  const updateStage = (
    id: string,
    key: keyof Omit<StageDraft, "id">,
    value: string
  ) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === id ? { ...stage, [key]: value } : stage
      )
    );
  };

  const addStage = () => {
    if (stages.length >= MAX_STAGES) {
      return;
    }
    setStages((prev) => [...prev, createEmptyStage(prev.length + Date.now())]);
  };

  const removeStage = (id: string) => {
    if (stages.length <= MIN_STAGES) {
      return;
    }
    setStages((prev) => prev.filter((stage) => stage.id !== id));
  };

  const fillExample = () => {
    setOperation(processDecompositionExample.operation);
    setContext(processDecompositionExample.context);
    setStages(
      processDecompositionExample.stages.map((stage, index) => ({
        id: `stage-example-${index + 1}`,
        ...stage,
      }))
    );
    setChecked(false);
  };

  const reset = () => {
    setOperation("");
    setContext("");
    setStages(createEmptyStages());
    setChecked(false);
    setReferenceOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Разложите операцию на 4–8 этапов. Для каждого укажите вход, действие,
          результат, роль ИИ и контроль человека.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillExample}
            className="h-9 border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
          >
            <Sparkles className="h-4 w-4" />
            Заполнить примером
          </Button>
          <ResetButton onClick={reset} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <FieldLabel
            label="Регулярная операция"
            hint="Название операции, которую вы разбираете."
          />
          <input
            value={operation}
            onChange={(event) => setOperation(event.target.value)}
            placeholder="Например: еженедельная сводка по обращениям клиентов"
            className={inputClassName}
          />
        </label>
        <label className="block">
          <FieldLabel
            label="Контекст"
            hint="Кто участвует, зачем нужен результат и где граница процесса."
          />
          <textarea
            value={context}
            onChange={(event) => setContext(event.target.value)}
            placeholder="Например: сводка уходит руководителю сервисной службы каждую неделю"
            rows={2}
            className={inputClassName}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          Этапов: {stages.length} (допустимо {MIN_STAGES}–{MAX_STAGES}).
          Заполнено полностью: {completedStages}.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStage}
            disabled={stages.length >= MAX_STAGES}
            className="h-9 border-black/15 bg-white text-foreground hover:bg-[#f3f1ec]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить этап
          </Button>
        </div>
      </div>

      <ProgressLine
        answered={completedStages}
        total={stages.length}
        extra={`${MIN_STAGES}–${MAX_STAGES} этапов`}
      />

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const complete = isStageComplete(stage);
          const missing = missingStageFields(stage);

          return (
            <div
              key={stage.id}
              className={cn(
                "rounded-xl border bg-white p-4 sm:p-5",
                checked && complete
                  ? "border-emerald-200"
                  : checked
                    ? "border-amber-200"
                    : "border-black/10"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Этап {index + 1}
                </p>
                <div className="flex items-center gap-2">
                  {checked &&
                    (complete ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        заполнено
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        не хватает: {missing.join(", ")}
                      </span>
                    ))}
                  {stages.length > MIN_STAGES && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStage(stage.id)}
                      className="h-8 border-red-200 bg-white text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Удалить
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {processStageFields.map((field) => (
                  <label
                    key={field.key}
                    className={cn(
                      "block",
                      field.key === "title" ||
                        field.key === "humanControl" ||
                        field.key === "exceptions"
                        ? "sm:col-span-2"
                        : ""
                    )}
                  >
                    <FieldLabel label={field.label} hint={field.hint} />
                    <textarea
                      value={stage[field.key]}
                      onChange={(event) =>
                        updateStage(stage.id, field.key, event.target.value)
                      }
                      placeholder={field.placeholder}
                      rows={field.rows}
                      className={inputClassName}
                    />
                  </label>
                ))}

                <label className="block">
                  <FieldLabel
                    label="Роль ИИ"
                    hint="Кто выполняет этап и кто отвечает за результат."
                  />
                  <select
                    value={stage.aiRole}
                    onChange={(event) =>
                      updateStage(stage.id, "aiRole", event.target.value)
                    }
                    className={selectClassName}
                  >
                    <option value="">Выберите вариант</option>
                    {(Object.keys(aiRoleLabels) as AiRole[]).map((value) => (
                      <option key={value} value={value}>
                        {aiRoleLabels[value]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <FieldLabel
                    label="Согласование"
                    hint="Нужно ли утверждение результата до следующего этапа."
                  />
                  <select
                    value={stage.approval}
                    onChange={(event) =>
                      updateStage(stage.id, "approval", event.target.value)
                    }
                    className={selectClassName}
                  >
                    {(Object.keys(approvalLabels) as Approval[]).map(
                      (value) => (
                        <option key={value} value={value}>
                          {approvalLabels[value]}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => setChecked(true)}
          className="bg-[#171717] text-white hover:bg-black"
        >
          <ClipboardList className="h-4 w-4" />
          Проверить разбор
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setReferenceOpen((prev) => !prev)}
          className="h-9 border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
        >
          <Lightbulb className="h-4 w-4 text-emerald-600" />
          {referenceOpen ? "Скрыть эталон" : "Показать эталон"}
        </Button>
      </div>

      {checked && (
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-lg border p-4",
            ready
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          {ready ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          )}
          <p
            className={cn(
              "text-sm leading-6",
              ready ? "text-emerald-900" : "text-amber-900"
            )}
          >
            {ready
              ? "Разбор заполнен: есть этап с контролем человека, точка согласования и обработка исключений. Сравните разбор с эталоном."
              : allStagesFilled && operation.trim().length > 0
                ? "Поля заполнены, но в процессе не хватает обязательного контроля: добавьте этап «Только человек» и хотя бы одну точку согласования."
                : `Разбор пока не готов: укажите операцию, оставьте не меньше ${MIN_STAGES} этапов и заполните все поля каждого этапа, включая роль ИИ и исключения.`}
          </p>
        </div>
      )}

      {referenceOpen && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Эталон: {processDecompositionExample.operation}
          </p>
          <p className="mt-1 text-xs leading-5 text-emerald-900/80">
            {processDecompositionExample.context}
          </p>
          <ol className="mt-3 space-y-2">
            {processDecompositionExample.stages.map((stage, index) => (
              <li
                key={stage.title}
                className="rounded-lg border border-emerald-200/70 bg-white p-3"
              >
                <p className="text-sm font-medium text-foreground">
                  {index + 1}. {stage.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {aiRoleLabels[stage.aiRole]} ·{" "}
                  {approvalLabels[stage.approval]}
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-900/85">
                  Контроль: {stage.humanControl}
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-900/85">
                  Исключение: {stage.exceptions}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

interface TemplateDraft {
  title: string;
  purpose: string;
  requiredInputs: string;
  variables: string;
  prompt: string;
  constraints: string;
  outputRequirements: string;
  checks: string;
}

function createEmptyTemplate(): TemplateDraft {
  return {
    title: "",
    purpose: "",
    requiredInputs: "",
    variables: "",
    prompt: "",
    constraints: "",
    outputRequirements: "",
    checks: "",
  };
}

function toLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function isTemplateComplete(template: TemplateDraft): boolean {
  return (
    template.title.trim().length > 0 &&
    template.purpose.trim().length > 0 &&
    toLines(template.requiredInputs).length > 0 &&
    toLines(template.variables).length > 0 &&
    template.prompt.trim().length > 0 &&
    toLines(template.constraints).length > 0 &&
    toLines(template.outputRequirements).length > 0 &&
    toLines(template.checks).length > 0
  );
}

function composeTemplate(template: TemplateDraft): string {
  const sections = [
    template.purpose.trim() ? `НАЗНАЧЕНИЕ\n${template.purpose.trim()}` : "",
    toLines(template.requiredInputs).length > 0
      ? `ОБЯЗАТЕЛЬНЫЕ ВХОДНЫЕ ДАННЫЕ\n${toLines(template.requiredInputs)
          .map((item) => `— ${item}`)
          .join("\n")}`
      : "",
    toLines(template.variables).length > 0
      ? `ПЕРЕМЕННЫЕ\n${toLines(template.variables).join(", ")}`
      : "",
    template.prompt.trim() ? `ПРОМПТ\n${template.prompt.trim()}` : "",
    toLines(template.constraints).length > 0
      ? `ОГРАНИЧЕНИЯ\n${toLines(template.constraints)
          .map((item) => `— ${item}`)
          .join("\n")}`
      : "",
    toLines(template.outputRequirements).length > 0
      ? `ТРЕБОВАНИЯ К РЕЗУЛЬТАТУ\n${toLines(template.outputRequirements)
          .map((item) => `— ${item}`)
          .join("\n")}`
      : "",
    toLines(template.checks).length > 0
      ? `ПРОВЕРКИ\n${toLines(template.checks)
          .map((item) => `— ${item}`)
          .join("\n")}`
      : "",
  ];

  return sections.filter(Boolean).join("\n\n");
}

export function TemplateBuilderPractice() {
  const [template, setTemplate] = useState<TemplateDraft>(createEmptyTemplate);
  const [checked, setChecked] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<PersonalPrompt[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const complete = isTemplateComplete(template);
  const preview = composeTemplate(template);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/personal-prompts", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Не удалось загрузить личную библиотеку.");
        }

        const data = (await response.json()) as {
          prompts?: PersonalPrompt[];
        };

        if (!cancelled) {
          setSavedPrompts(data.prompts ?? []);
        }
      } catch {
        if (!cancelled) {
          setListError(
            "Не удалось загрузить сохранённые шаблоны. Сохранение новых шаблонов всё равно доступно."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSaved(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateTemplate = (key: keyof TemplateDraft, value: string) => {
    setTemplate((prev) => ({ ...prev, [key]: value }));
  };

  const fillExample = () => {
    setTemplate({
      title: templateExample.title,
      purpose: templateExample.purpose,
      requiredInputs: templateExample.requiredInputs.join("\n"),
      variables: templateExample.variables.join("\n"),
      prompt: templateExample.prompt,
      constraints: templateExample.constraints.join("\n"),
      outputRequirements: templateExample.outputRequirements.join("\n"),
      checks: templateExample.checks.join("\n"),
    });
    setChecked(false);
  };

  const reset = () => {
    setTemplate(createEmptyTemplate());
    setChecked(false);
    setReferenceOpen(false);
  };

  const copyTemplate = async () => {
    if (!preview) {
      return;
    }

    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      toast.success("Шаблон скопирован", {
        description: "Текст готов к вставке в ИИ-сервис.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать", {
        description: "Выделите текст предпросмотра и скопируйте вручную.",
      });
    }
  };

  const saveTemplate = async () => {
    if (!complete || saving) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/personal-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: template.title.trim(),
          purpose: template.purpose.trim(),
          category: "Оптимизация рабочих процессов",
          requiredInputs: toLines(template.requiredInputs),
          variables: toLines(template.variables),
          promptText: template.prompt.trim(),
          constraints: toLines(template.constraints),
          outputRequirements: toLines(template.outputRequirements),
          checks: toLines(template.checks),
          source: "lesson",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(
          data?.error ?? "Не удалось сохранить шаблон. Попробуйте ещё раз."
        );
      }

      const data = (await response.json()) as { prompt: PersonalPrompt };
      setSavedPrompts((prev) => [data.prompt, ...prev]);
      setListError(null);
      toast.success("Шаблон сохранён в личной библиотеке", {
        description:
          "Он появится в списке ниже и останется после перезагрузки.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось сохранить шаблон. Попробуйте ещё раз.";

      toast.error("Не удалось сохранить шаблон", { description: message });
    } finally {
      setSaving(false);
    }
  };

  const deleteSavedPrompt = async (id: string) => {
    try {
      const response = await fetch(
        `/api/personal-prompts?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(data?.error ?? "Не удалось удалить шаблон.");
      }

      setSavedPrompts((prev) => prev.filter((item) => item.id !== id));
      toast.success("Шаблон удалён из личной библиотеки");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось удалить шаблон.";
      toast.error("Ошибка удаления", { description: message });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm leading-6 text-muted-foreground">
          Заполните семь элементов шаблона. Затем проверьте его и сохраните в
          личной библиотеке.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillExample}
            className="h-9 border-black/15 bg-white text-foreground hover:bg-[#f9f8f5]"
          >
            <Sparkles className="h-4 w-4" />
            Заполнить примером
          </Button>
          <ResetButton onClick={reset} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {templateFields.map((field) => (
          <label
            key={field.key}
            className={cn(
              "block",
              field.key === "title" ||
                field.key === "purpose" ||
                field.key === "prompt"
                ? "sm:col-span-2"
                : ""
            )}
          >
            <FieldLabel label={field.label} hint={field.hint} />
            <textarea
              value={template[field.key]}
              onChange={(event) =>
                updateTemplate(field.key, event.target.value)
              }
              placeholder={field.placeholder}
              rows={field.rows}
              className={inputClassName}
            />
          </label>
        ))}
      </div>

      <ProgressLine
        answered={
          [
            template.title,
            template.purpose,
            template.requiredInputs,
            template.variables,
            template.prompt,
            template.constraints,
            template.outputRequirements,
            template.checks,
          ].filter((value) => value.trim().length > 0).length
        }
        total={8}
        extra="8 полей шаблона"
      />

      {preview && (
        <details className="rounded-lg border border-black/10 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Предпросмотр шаблона
          </summary>
          <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg border border-black/10 bg-[#f9f8f5] p-4 font-sans text-sm leading-6 text-foreground/85">
            {preview}
          </pre>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void copyTemplate();
            }}
            className="mt-3 h-9 border-black/15 bg-white text-foreground hover:bg-[#f3f1ec]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Скопировать шаблон
              </>
            )}
          </Button>
        </details>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setChecked(true)}
          className="h-10 border-black/15 bg-white text-foreground hover:bg-[#f3f1ec]"
        >
          <ClipboardList className="h-4 w-4" />
          Проверить шаблон
        </Button>
        <Button
          type="button"
          onClick={() => {
            void saveTemplate();
          }}
          disabled={!complete || saving}
          className="bg-[#f36f21] text-white hover:bg-[#d95c16] disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Сохраняем...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Сохранить в личной библиотеке
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setReferenceOpen((prev) => !prev)}
          className="h-9 border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
        >
          <Lightbulb className="h-4 w-4 text-emerald-600" />
          {referenceOpen ? "Скрыть эталон" : "Показать эталон"}
        </Button>
      </div>

      {checked && (
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-lg border p-4",
            complete
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          {complete ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          )}
          <p
            className={cn(
              "text-sm leading-6",
              complete ? "text-emerald-900" : "text-amber-900"
            )}
          >
            {complete
              ? "Все семь элементов заполнены. Сохраните шаблон в личной библиотеке и сравните его с эталоном."
              : "Заполните все семь элементов: название, назначение, входные данные, переменные, промпт, ограничения, требования к результату и проверки."}
          </p>
        </div>
      )}

      <section className="rounded-lg border border-black/10 bg-white p-4">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-[#f36f21]" />
          <p className="text-sm font-semibold text-foreground">
            Личная библиотека промптов
          </p>
        </div>

        {loadingSaved ? (
          <div className="mt-3 space-y-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : listError ? (
          <p className="mt-3 text-sm leading-6 text-amber-800">{listError}</p>
        ) : savedPrompts.length === 0 ? (
          <div className="mt-3 flex flex-col items-center gap-2 rounded-lg border border-dashed border-black/15 bg-[#f9f8f5] px-4 py-6 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f1ec] text-muted-foreground">
              <Bookmark className="h-5 w-5" />
            </span>
            <p className="text-sm text-muted-foreground">
              Пока нет сохранённых шаблонов. Заполните форму и сохраните первый.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-2">
            {savedPrompts.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-black/10 bg-[#f9f8f5] p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                    {item.purpose}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.category} ·{" "}
                    {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void deleteSavedPrompt(item.id);
                  }}
                  className="h-8 border-red-200 bg-white text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Удалить
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {referenceOpen && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            Эталон: шаблон для еженедельной сводки
          </p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-emerald-900/85">
            <p>
              <span className="font-medium text-emerald-900">Название:</span>{" "}
              {templateExample.title}
            </p>
            <p>
              <span className="font-medium text-emerald-900">Назначение:</span>{" "}
              {templateExample.purpose}
            </p>
            <p>
              <span className="font-medium text-emerald-900">
                Входные данные:
              </span>{" "}
              {templateExample.requiredInputs.join("; ")}
            </p>
            <p>
              <span className="font-medium text-emerald-900">Переменные:</span>{" "}
              {templateExample.variables.join(", ")}
            </p>
            <p>
              <span className="font-medium text-emerald-900">Ограничения:</span>{" "}
              {templateExample.constraints.join("; ")}
            </p>
            <p>
              <span className="font-medium text-emerald-900">
                Требования к результату:
              </span>{" "}
              {templateExample.outputRequirements.join("; ")}
            </p>
            <p>
              <span className="font-medium text-emerald-900">Проверки:</span>{" "}
              {templateExample.checks.join("; ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
