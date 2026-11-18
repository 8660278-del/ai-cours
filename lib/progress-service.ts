import { isDatabaseAvailable } from "./db";
import { getProgressById, putProgress, type Progress } from "./models";
import { createEmptyProgress, LEARNER_ID } from "./progress";

export async function loadProgress(): Promise<Progress> {
  if (!(await isDatabaseAvailable())) {
    return createEmptyProgress();
  }

  try {
    const progress = await getProgressById(LEARNER_ID);
    return progress ?? createEmptyProgress();
  } catch (error) {
    console.warn("Не удалось загрузить прогресс.", error);
    return createEmptyProgress();
  }
}

export class ProgressSaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProgressSaveError";
  }
}

export async function completeLesson(
  lessonId: string,
  taskId: string
): Promise<Progress> {
  if (!(await isDatabaseAvailable())) {
    throw new ProgressSaveError(
      "Сервер сохранения прогресса недоступен. Попробуйте ещё раз через минуту."
    );
  }

  const existing = await getProgressById(LEARNER_ID);
  const now = new Date().toISOString();
  const base: Progress = existing ?? {
    id: LEARNER_ID,
    completedLessons: [],
    completedTasks: [],
    createdAt: now,
    updatedAt: now,
  };

  const next: Progress = {
    ...base,
    completedLessons: Array.from(new Set([...base.completedLessons, lessonId])),
    completedTasks: Array.from(new Set([...base.completedTasks, taskId])),
    updatedAt: now,
  };

  await putProgress(next);
  return next;
}
