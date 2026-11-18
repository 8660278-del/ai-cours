import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getLessonById, getModuleByLessonId } from "@/lib/course-data";
import { isDatabaseAvailable } from "@/lib/db";
import { isModuleUnlocked } from "@/lib/progress";
import { completeLesson, loadProgress } from "@/lib/progress-service";

const completeLessonSchema = z.object({
  lessonId: z.string().min(1).max(120),
  taskId: z.string().min(1).max(160),
});

export const dynamic = "force-dynamic";

export async function GET() {
  const [progress, database] = await Promise.all([
    loadProgress(),
    isDatabaseAvailable(),
  ]);

  return NextResponse.json({ progress, database });
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

  const parsed = completeLessonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Некорректные данные для сохранения прогресса." },
      { status: 400 }
    );
  }

  const { lessonId, taskId } = parsed.data;
  const courseModule = getModuleByLessonId(lessonId);
  const lesson = getLessonById(courseModule?.id ?? "", lessonId);

  if (!courseModule || !lesson) {
    return NextResponse.json({ error: "Урок не найден." }, { status: 404 });
  }

  const hasTask = lesson.blocks.some(
    (block) => block.type === "task" && block.taskId === taskId
  );

  if (!hasTask) {
    return NextResponse.json(
      { error: "Задание не относится к этому уроку." },
      { status: 400 }
    );
  }

  const progress = await loadProgress();

  if (!isModuleUnlocked(courseModule.id, progress)) {
    return NextResponse.json(
      {
        error: "Модуль ещё закрыт. Сначала завершите предыдущий модуль курса.",
      },
      { status: 403 }
    );
  }

  try {
    const updated = await completeLesson(lessonId, taskId);
    return NextResponse.json({ progress: updated });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось сохранить прогресс. Попробуйте ещё раз.";

    return NextResponse.json({ error: message }, { status: 503 });
  }
}
