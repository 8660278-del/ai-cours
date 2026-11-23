import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Fingerprint,
  Info,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  securityLevels,
  securityProtocolSteps,
  type SecurityLevelTone,
} from "@/lib/security-data";
import { loadProgress } from "@/lib/progress-service";
import { SecurityTrainer } from "@/components/security-trainer";

export const dynamic = "force-dynamic";

const levelStyles: Record<
  SecurityLevelTone,
  { card: string; badge: string; icon: string }
> = {
  open: {
    card: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-800",
    icon: "bg-emerald-100 text-emerald-700",
  },
  internal: {
    card: "border-sky-200 bg-sky-50",
    badge: "bg-sky-100 text-sky-800",
    icon: "bg-sky-100 text-sky-700",
  },
  confidential: {
    card: "border-amber-200 bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
    icon: "bg-amber-100 text-amber-700",
  },
  restricted: {
    card: "border-red-200 bg-red-50",
    badge: "bg-red-100 text-red-800",
    icon: "bg-red-100 text-red-700",
  },
};

const levelIcons: Record<SecurityLevelTone, LucideIcon> = {
  open: Eye,
  internal: Info,
  confidential: Lock,
  restricted: Fingerprint,
};

export default async function SecurityPage() {
  const progress = await loadProgress();
  const trainerResult = progress.securityTrainer ?? null;

  return (
    <div className="bg-[#f6f5f2]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="border-b border-black/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Информационная безопасность
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#171717] px-2.5 py-1 text-[11px] font-medium text-white">
              <ShieldCheck className="h-3 w-3 text-[#f36f21]" />
              Сквозной блок курса
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            Какие данные можно передавать ИИ
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
            Безопасность начинается с вопроса: что именно я собираюсь отправить?
            Ниже — четыре уровня данных, единый протокол безопасной работы и
            тренажёр реальных рабочих ситуаций. Правила действуют во всех
            модулях курса.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="#data-levels"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#171717] px-4 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Уровни данных
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#trainer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold text-foreground transition-colors hover:bg-[#f3f1ec]"
            >
              Перейти к тренажёру
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </header>

        <section id="data-levels" className="mt-8 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Четыре уровня данных
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Чем выше уровень, тем строже правила. Если в материале смешаны
            разные сведения, ориентируйтесь на самый высокий уровень.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {securityLevels.map((level, index) => {
              const styles = levelStyles[level.tone];
              const Icon = levelIcons[level.tone];

              return (
                <article
                  key={level.id}
                  className={cn("rounded-xl border p-5", styles.card)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          styles.icon
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] opacity-70">
                          Уровень {index + 1}
                        </p>
                        <h3 className="text-base font-semibold text-foreground">
                          {level.title}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        styles.badge
                      )}
                    >
                      {level.badge}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-foreground/80">
                    {level.summary}
                  </p>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Примеры
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {level.examples.map((example) => (
                      <li
                        key={example}
                        className="flex gap-2 text-sm leading-6 text-foreground/80"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-50"
                          aria-hidden="true"
                        />
                        {example}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Правила использования
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {level.rules.map((rule) => (
                      <li
                        key={rule}
                        className="flex gap-2 text-sm leading-6 text-foreground/80"
                      >
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-black/10 bg-[#171717] p-5 text-white">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#f36f21]" />
            <p className="text-sm leading-6 text-white/85">
              Окончательные правила соответствуют политике информационной
              безопасности компании. Если политика запрещает действие, которое
              кажется допустимым в курсе, приоритет всегда у политики компании.
              При сомнении обратитесь к ответственному за информационную
              безопасность.
            </p>
          </div>
        </section>

        <section id="protocol" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Протокол безопасной работы из семи шагов
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Проходите эти шаги каждый раз, когда готовите запрос к ИИ с рабочими
            данными.
          </p>

          <ol className="mt-5 space-y-3">
            {securityProtocolSteps.map((step, index) => (
              <li
                key={step.id}
                className="flex gap-4 rounded-xl border border-black/10 bg-white p-4 sm:p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff7f1] text-sm font-semibold text-[#c8560f]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <Fingerprint className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Обезличивание не гарантирует анонимность
                </h3>
                <p className="mt-1 text-sm leading-6 text-amber-900/85">
                  Даже после удаления ФИО человека можно узнать по совокупности
                  деталей: должности, подразделения, даты, редкой специализации
                  или контекста проекта. Обезличивание снижает риск, но не
                  отменяет проверку сервиса, категории данных и минимального
                  объёма. Если идентификация всё ещё возможна, данные нельзя
                  передавать во внешний сервис.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="trainer" className="mt-10 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Тренажёр ситуаций
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Шесть рабочих ситуаций. Выберите «разрешено», «разрешено при
                соблюдении условий» или «запрещено» — и прочитайте объяснение.
              </p>
            </div>
            <Link
              href="/progress"
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
            >
              Мой прогресс
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5">
            <SecurityTrainer initialResult={trainerResult} />
          </div>
        </section>
      </div>
    </div>
  );
}
