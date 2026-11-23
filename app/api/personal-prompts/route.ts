import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { mockPersonalPrompts } from "@/lib/mock-data";
import {
  createPersonalPrompt,
  deletePersonalPrompt,
  getPersonalPromptsByLearner,
} from "@/lib/models";
import { LEARNER_ID } from "@/lib/progress";
import { createPersonalPromptSchema } from "@/lib/validation/personal-prompts";

export const dynamic = "force-dynamic";

const DATABASE_UNAVAILABLE_MESSAGE =
  "Сервер хранения личной библиотеки временно недоступен. Попробуйте сохранить шаблон позже.";

export async function GET() {
  if (!(await isDatabaseAvailable())) {
    return NextResponse.json({
      prompts: mockPersonalPrompts,
      database: false,
    });
  }

  try {
    const prompts = await getPersonalPromptsByLearner(LEARNER_ID);
    return NextResponse.json({ prompts, database: true });
  } catch (error) {
    console.error("Не удалось загрузить личную библиотеку промптов.", error);
    return NextResponse.json(
      { error: "Не удалось загрузить личную библиотеку промптов." },
      { status: 500 }
    );
  }
}

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

  const parsed = createPersonalPromptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Некорректные данные шаблона.",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  try {
    const prompt = await createPersonalPrompt({
      id: crypto.randomUUID(),
      learnerId: LEARNER_ID,
      ...parsed.data,
    });

    return NextResponse.json({ prompt }, { status: 201 });
  } catch (error) {
    console.error("Не удалось сохранить личный шаблон.", error);
    return NextResponse.json(
      { error: "Не удалось сохранить шаблон. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isDatabaseAvailable())) {
    return NextResponse.json(
      { error: DATABASE_UNAVAILABLE_MESSAGE },
      { status: 503 }
    );
  }

  const id = new URL(request.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Не указан идентификатор шаблона." },
      { status: 400 }
    );
  }

  try {
    await deletePersonalPrompt(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Не удалось удалить личный шаблон.", error);
    return NextResponse.json(
      { error: "Не удалось удалить шаблон. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
