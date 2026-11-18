import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ModuleStatus } from "@/lib/progress";
import { cn } from "@/lib/utils";

const statusMeta: Record<
  ModuleStatus,
  { label: string; className: string; icon: LucideIcon }
> = {
  completed: {
    label: "Завершён",
    className: "border-transparent bg-[#171717] text-white",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "В процессе",
    className: "border-[#f36f21]/40 bg-[#fff7f1] text-[#c8560f]",
    icon: PlayCircle,
  },
  not_started: {
    label: "Не начат",
    className: "border-black/10 bg-transparent text-muted-foreground",
    icon: Circle,
  },
};

export function ModuleStatusBadge({
  status,
  locked = false,
  className,
}: {
  status: ModuleStatus;
  locked?: boolean;
  className?: string;
}) {
  const meta = locked
    ? {
        label: "Закрыт",
        className: "border-black/10 bg-[#f3f1ec] text-muted-foreground",
        icon: Lock,
      }
    : statusMeta[status];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        meta.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

export function LessonStatusBadge({ completed }: { completed: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        completed
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-black/10 bg-transparent text-muted-foreground"
      )}
    >
      {completed ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <Circle className="h-3 w-3" />
      )}
      {completed ? "Пройден" : "Не пройден"}
    </span>
  );
}
