export type CardTone = "default" | "accent" | "success" | "warning" | "danger";

export interface CardItem {
  title: string;
  body: string;
  items?: string[];
  tone?: CardTone;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface TaskReference {
  title?: string;
  items: string[];
}

export type LessonBlock =
  | {
      id: string;
      type: "text";
      title: string;
      paragraphs: string[];
    }
  | {
      id: string;
      type: "card";
      title: string;
      body: string;
      tone?: CardTone;
    }
  | {
      id: string;
      type: "cards";
      title: string;
      intro?: string;
      items: CardItem[];
    }
  | {
      id: string;
      type: "list";
      title: string;
      items: string[];
    }
  | {
      id: string;
      type: "steps";
      title: string;
      intro?: string;
      steps: StepItem[];
    }
  | {
      id: string;
      type: "comparison";
      title: string;
      intro?: string;
      beforeLabel: string;
      afterLabel: string;
      before: string[];
      after: string[];
    }
  | {
      id: string;
      type: "right-wrong";
      title: string;
      intro?: string;
      rightLabel?: string;
      wrongLabel?: string;
      right: string[];
      wrong: string[];
    }
  | {
      id: string;
      type: "template";
      title: string;
      description?: string;
      body: string;
      note?: string;
    }
  | {
      id: string;
      type: "task";
      taskId: string;
      title: string;
      description: string;
      condition?: string;
      data?: string[];
      instructions: string[];
      expected?: string[];
      criteria: string[];
      interactiveId?: string;
      reference?: TaskReference;
    }
  | {
      id: string;
      type: "memo";
      title: string;
      items: string[];
    };
