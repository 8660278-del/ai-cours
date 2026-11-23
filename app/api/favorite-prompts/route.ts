import { NextResponse, type NextRequest } from "next/server";
import { isDatabaseAvailable } from "@/lib/db";
import { mockFavoritePrompts } from "@/lib/mock-data";
import {
  addFavoritePrompt,
  getFavoritePromptsByLearner,
  removeFavoritePrompt,
} from "@/lib/models";
import { LEARNER_ID } from "@/lib/progress";
import { favoritePromptSchema } from "@/lib/validation/library-prompts";

export const dynamic = "force-dynamic";

const DATABASE_UNAVAILABLE_MESSAGE =
  "Сервер хранения избранного временно недоступен. Попробуйте ещё раз позже.";

export async function GET() {
  if (!(await isDatabaseAvailable())) {
    return NextResponse.json({
      promptIds: mockFavoritePrompts.map((favorite) => favorite.promptId),
      database: false,
    });
  }

  try {
    const favorites = await getFavoritePromptsByLearner(LEARNER_ID);
    return NextResponse.json({
      promptIds: favorites.map((favorite) => favorite.promptId),
      database: true,
    });
  } catch (error) {
    console.error("Не удалось загрузить избранные промпты.", error);
    return NextResponse.json(
      { error: "Не удалось загрузить избранные промпты." },
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

  const parsed = favoritePromptSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Не указан промпт для добавления в избранное." },
      { status: 400 }
    );
  }

  try {
    const favorite = await addFavoritePrompt(LEARNER_ID, parsed.data.promptId);
    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("Не удалось добавить промпт в избранное.", error);
    return NextResponse.json(
      { error: "Не удалось добавить промпт в избранное. Попробуйте ещё раз." },
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

  const parsed = favoritePromptSchema.safeParse({
    promptId: new URL(request.url).searchParams.get("promptId"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Не указан промпт для удаления из избранного." },
      { status: 400 }
    );
  }

  try {
    await removeFavoritePrompt(LEARNER_ID, parsed.data.promptId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Не удалось удалить промпт из избранного.", error);
    return NextResponse.json(
      { error: "Не удалось удалить промпт из избранного. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
