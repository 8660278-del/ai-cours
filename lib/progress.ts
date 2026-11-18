import {
  courseModules,
  type CourseLesson,
  type CourseModule,
} from "./course-data";
import type { Progress } from "./models";

export const LEARNER_ID = "gk-pir-learner";

export type ModuleStatus = "completed" | "in_progress" | "not_started";

export interface LessonRef {
  module: CourseModule;
  lesson: CourseLesson;
  moduleIndex: number;
  lessonIndex: number;
}

export const EMPTY_PROGRESS: Progress = {
  id: LEARNER_ID,
  completedLessons: [],
  completedTasks: [],
  createdAt: "",
  updatedAt: "",
};

export function createEmptyProgress(): Progress {
  return {
    ...EMPTY_PROGRESS,
    completedLessons: [],
    completedTasks: [],
  };
}

const allLessons = courseModules.flatMap((module, moduleIndex) =>
  module.lessons.map((lesson, lessonIndex) => ({
    module,
    lesson,
    moduleIndex,
    lessonIndex,
  }))
);

const lessonIdSet = new Set(allLessons.map((ref) => ref.lesson.id));
const taskIdSet = new Set(
  allLessons.flatMap((ref) =>
    ref.lesson.blocks
      .filter((block) => block.type === "task")
      .map((block) => block.taskId)
  )
);

export const totalLessons = allLessons.length;
export const totalTasks = taskIdSet.size;

export function isLessonCompleted(
  progress: Progress,
  lessonId: string
): boolean {
  return progress.completedLessons.includes(lessonId);
}

export function isTaskCompleted(progress: Progress, taskId: string): boolean {
  return progress.completedTasks.includes(taskId);
}

export function getModuleCompletedLessons(
  module: CourseModule,
  progress: Progress
): number {
  return module.lessons.filter((lesson) =>
    isLessonCompleted(progress, lesson.id)
  ).length;
}

export function isModuleCompleted(
  module: CourseModule,
  progress: Progress
): boolean {
  return (
    module.lessons.length > 0 &&
    module.lessons.every((lesson) => isLessonCompleted(progress, lesson.id))
  );
}

export function getModuleStatus(
  module: CourseModule,
  progress: Progress
): ModuleStatus {
  const completed = getModuleCompletedLessons(module, progress);

  if (completed === 0) {
    return "not_started";
  }

  if (completed === module.lessons.length) {
    return "completed";
  }

  return "in_progress";
}

export function isModuleUnlocked(
  moduleId: string,
  progress: Progress
): boolean {
  const index = courseModules.findIndex((module) => module.id === moduleId);

  if (index <= 0) {
    return index === 0;
  }

  return isModuleCompleted(courseModules[index - 1], progress);
}

export function getCourseStats(progress: Progress) {
  const completedLessons = progress.completedLessons.filter((id) =>
    lessonIdSet.has(id)
  ).length;
  const completedTasks = progress.completedTasks.filter((id) =>
    taskIdSet.has(id)
  ).length;
  const completedModules = courseModules.filter((module) =>
    isModuleCompleted(module, progress)
  ).length;
  const percent =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  return {
    percent,
    completedLessons,
    totalLessons,
    completedTasks,
    totalTasks,
    completedModules,
    totalModules: courseModules.length,
  };
}

export function getModulePercent(module: CourseModule, progress: Progress) {
  if (module.lessons.length === 0) {
    return 0;
  }

  return Math.round(
    (getModuleCompletedLessons(module, progress) / module.lessons.length) * 100
  );
}

export function getContinueLesson(progress: Progress) {
  for (const ref of allLessons) {
    if (!isModuleUnlocked(ref.module.id, progress)) {
      continue;
    }

    if (!isLessonCompleted(progress, ref.lesson.id)) {
      return { ...ref, allCompleted: false };
    }
  }

  return {
    ...allLessons[allLessons.length - 1],
    allCompleted: true,
  };
}

export function getAdjacentLessons(
  moduleId: string,
  lessonId: string
): { previous: LessonRef | null; next: LessonRef | null } {
  const index = allLessons.findIndex(
    (ref) => ref.module.id === moduleId && ref.lesson.id === lessonId
  );

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? allLessons[index - 1] : null,
    next: index < allLessons.length - 1 ? allLessons[index + 1] : null,
  };
}

export function getCompletedLessonRefs(progress: Progress): LessonRef[] {
  return allLessons.filter((ref) => isLessonCompleted(progress, ref.lesson.id));
}

export function getCompletedTaskBlocks(progress: Progress) {
  return allLessons.flatMap((ref) =>
    ref.lesson.blocks
      .filter((block) => block.type === "task")
      .filter((block) => progress.completedTasks.includes(block.taskId))
      .map((block) => ({ ...block, module: ref.module, lesson: ref.lesson }))
  );
}

export function getLessonTaskIds(lesson: CourseLesson): string[] {
  return lesson.blocks
    .filter((block) => block.type === "task")
    .map((block) => block.taskId);
}
