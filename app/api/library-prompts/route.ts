import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { createPersonalPrompt } from "@/lib/models";
import { LEARNER_ID } from "@/lib/progress";
import { createLibraryPromptSchema } from "@/lib/validation/library-prompts";

export const dynamic = "force-dynamic";

const DATABASE_UNAVAILABLE_MESSAGE =
  "Сервер хранения личных промптов временно недоступен. Попробуйте сохранить промпт позже.";

const DEFAULT_CHECKS = [
  "Проверьте факты, цифры и имена перед использованием результата.",
  "Убедитесь, что ответ соответствует задаче и ограничениям.",
];

export async function POST(request: NextRequest) {
  if (!(await isDatabaseAvailable())) {
    return NextResponse.json(
      { error: DATABASE_UNAVAILABLE_MESSAGE },
      { status: 503 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Некорректный запрос." },
      { status: 400 }
    );
  }

  const parsed = createLibraryPromptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Проверьте название, категорию и текст промпта.",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const prompt = await createPersonalPrompt({
      id: crypto.randomUUID(),
      learnerId: LEARNER_ID,
      title: data.title,
      purpose:
        data.purpose?.trim() ||
        `Личный промпт «${data.title}» для рабочей задачи.`,
      situation: data.situation?.trim() || undefined,
      category: data.category,
      requiredInputs: [],
      variables: data.variables,
      promptText: data.promptText,
      constraints: [],
      outputRequirements: ["Полный текст промпта"],
      checks: data.checks.length > 0 ? data.checks : DEFAULT_CHECKS,
      exampleOutput: data.exampleOutput?.trim() || undefined,
      source: "library",
    });

    return NextResponse.json({ prompt }, { status: 201 });
  } catch (error) {
    console.error("Не удалось сохранить личный промпт.", error);
    return NextResponse.json(
      { error: "Не удалось сохранить промпт. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
