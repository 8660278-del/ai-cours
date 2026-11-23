import { NextResponse, type NextRequest } from "next/server";
import {
  securityTrainerSituations,
  type SecurityVerdict,
} from "@/lib/security-data";
import { securityTrainerSaveSchema } from "@/lib/validation/security-trainer";
import { loadProgress, saveSecurityTrainer } from "@/lib/progress-service";

export const dynamic = "force-dynamic";

const situationIds = new Set(
  securityTrainerSituations.map((situation) => situation.id)
);

export async function GET() {
  const progress = await loadProgress();

  return NextResponse.json({
    result: progress.securityTrainer ?? null,
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Некорректный запрос." },
      { status: 400 }
    );
  }

  const parsed = securityTrainerSaveSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Некорректные данные ответов тренажёра.",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const answers: Record<string, SecurityVerdict> = {};

  for (const [situationId, verdict] of Object.entries(parsed.data.answers)) {
    if (situationIds.has(situationId)) {
      answers[situationId] = verdict;
    }
  }

  try {
    const result = await saveSecurityTrainer(answers);
    return NextResponse.json({ result });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось сохранить результат. Попробуйте ещё раз.";

    return NextResponse.json({ error: message }, { status: 503 });
  }
}
