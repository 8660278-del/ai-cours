"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonCompletionProps {
  lessonId: string;
  taskId: string;
  completed: boolean;
}

export function LessonCompletion({
  lessonId,
  taskId,
  completed,
}: LessonCompletionProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(completed);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(async () => {
    if (pending) {
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, taskId }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(
          data?.error ??
            "Не удалось сохранить прогресс. Проверьте подключение и попробуйте ещё раз."
        );
      }

      setIsCompleted(true);
      toast.success("Прогресс сохранён", {
        description: "Урок отмечен пройденным.",
      });
      router.refresh();
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Не удалось сохранить прогресс. Попробуйте ещё раз.";

      setError(message);
      toast.error("Не удалось сохранить прогресс", {
        description: message,
        action: {
          label: "Повторить",
          onClick: () => {
            void save();
          },
        },
      });
    } finally {
      setPending(false);
    }
  }, [lessonId, pending, router, taskId]);

  if (isCompleted) {
    return (
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-900">
            Задание выполнено — урок пройден
          </p>
          <p className="mt-1 text-sm leading-relaxed text-emerald-800">
            Прогресс сохранён на сервере. Вы можете перечитывать блоки урока в
            любое время — отметка о прохождении останется.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-lg border border-[#f36f21]/30 bg-[#fff7f1] p-4">
      <p className="text-sm leading-relaxed text-foreground">
        Открытие урока не завершает его. Отметьте выполнение задания, когда
        закончите практику — после этого урок будет считаться пройденным, а
        общий прогресс обновится.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={() => {
            void save();
          }}
          disabled={pending}
          size="lg"
          className="bg-[#f36f21] text-white hover:bg-[#d95c16] focus-visible:ring-[#f36f21]"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Сохраняем...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Подтвердить выполнение задания
            </>
          )}
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-md border border-red-200 bg-red-50 p-3"
        >
          <p className="text-sm font-medium text-red-800">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void save();
            }}
            disabled={pending}
            className={cn(
              "mt-2 border-red-300 bg-white text-red-800 hover:bg-red-50",
              pending && "opacity-60"
            )}
          >
            <RotateCcw className="h-4 w-4" />
            Повторить сохранение
          </Button>
        </div>
      )}
    </div>
  );
}
