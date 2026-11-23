import { docClient } from "./db";
import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { TableName, IndexName } from "./schema";
import type { SecurityTrainerResult } from "./security-data";

export interface Service {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive" | "deploying";
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getServiceById(id: string): Promise<Service | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TableName.SERVICES,
      Key: { id },
    })
  );
  return (result.Item as Service) ?? null;
}

export async function getServicesByStatus(status: string): Promise<Service[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TableName.SERVICES,
      IndexName: IndexName.SERVICES_STATUS,
      KeyConditionExpression: "#status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
      },
    })
  );
  return (result.Items as Service[]) ?? [];
}

export async function getAllServices(): Promise<Service[]> {
  const result = await docClient.send(
    new ScanCommand({
      TableName: TableName.SERVICES,
    })
  );
  return (result.Items as Service[]) ?? [];
}

export async function createService(
  data: Omit<Service, "createdAt" | "updatedAt">
): Promise<Service> {
  const now = new Date().toISOString();
  const service: Service = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: TableName.SERVICES,
      Item: service,
    })
  );

  return service;
}

export async function updateService(
  id: string,
  data: Partial<Pick<Service, "name" | "description" | "status" | "url">>
): Promise<Service> {
  const updateExpr = [];
  const exprValues: Record<string, unknown> = {};
  const exprNames: Record<string, string> = {};

  if (data.name !== undefined) {
    updateExpr.push("#name = :name");
    exprValues[":name"] = data.name;
    exprNames["#name"] = "name";
  }

  if (data.description !== undefined) {
    updateExpr.push("#description = :description");
    exprValues[":description"] = data.description;
    exprNames["#description"] = "description";
  }

  if (data.status !== undefined) {
    updateExpr.push("#status = :status");
    exprValues[":status"] = data.status;
    exprNames["#status"] = "status";
  }

  if (data.url !== undefined) {
    updateExpr.push("#url = :url");
    exprValues[":url"] = data.url;
    exprNames["#url"] = "url";
  }

  updateExpr.push("updatedAt = :updatedAt");
  exprValues[":updatedAt"] = new Date().toISOString();

  const result = await docClient.send(
    new UpdateCommand({
      TableName: TableName.SERVICES,
      Key: { id },
      UpdateExpression: `set ${updateExpr.join(", ")}`,
      ExpressionAttributeValues: exprValues,
      ExpressionAttributeNames:
        Object.keys(exprNames).length > 0 ? exprNames : undefined,
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes as Service;
}

export async function deleteService(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TableName.SERVICES,
      Key: { id },
    })
  );
}

export interface Progress {
  id: string;
  completedLessons: string[];
  completedTasks: string[];
  securityTrainer?: SecurityTrainerResult;
  createdAt: string;
  updatedAt: string;
}

export async function getProgressById(id: string): Promise<Progress | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TableName.PROGRESS,
      Key: { id },
    })
  );
  return (result.Item as Progress) ?? null;
}

export async function putProgress(progress: Progress): Promise<Progress> {
  await docClient.send(
    new PutCommand({
      TableName: TableName.PROGRESS,
      Item: progress,
    })
  );
  return progress;
}

export interface PersonalPrompt {
  id: string;
  learnerId: string;
  title: string;
  purpose: string;
  situation?: string;
  category: string;
  requiredInputs: string[];
  variables: string[];
  promptText: string;
  constraints: string[];
  outputRequirements: string[];
  checks: string[];
  exampleOutput?: string;
  source: "lesson" | "library";
  createdAt: string;
  updatedAt: string;
}

export async function getPersonalPromptsByLearner(
  learnerId: string
): Promise<PersonalPrompt[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TableName.PERSONAL_PROMPTS,
      IndexName: IndexName.PERSONAL_PROMPTS_LEARNER,
      KeyConditionExpression: "#learnerId = :learnerId",
      ExpressionAttributeNames: {
        "#learnerId": "learnerId",
      },
      ExpressionAttributeValues: {
        ":learnerId": learnerId,
      },
    })
  );

  const prompts = (result.Items as PersonalPrompt[]) ?? [];

  return prompts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createPersonalPrompt(
  data: Omit<PersonalPrompt, "createdAt" | "updatedAt">
): Promise<PersonalPrompt> {
  const now = new Date().toISOString();
  const prompt: PersonalPrompt = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: TableName.PERSONAL_PROMPTS,
      Item: prompt,
    })
  );

  return prompt;
}

export async function deletePersonalPrompt(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TableName.PERSONAL_PROMPTS,
      Key: { id },
    })
  );
}

export interface FavoritePrompt {
  id: string;
  learnerId: string;
  promptId: string;
  createdAt: string;
}

function favoritePromptId(learnerId: string, promptId: string): string {
  return `${learnerId}#${promptId}`;
}

export async function getFavoritePromptsByLearner(
  learnerId: string
): Promise<FavoritePrompt[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TableName.FAVORITE_PROMPTS,
      IndexName: IndexName.FAVORITE_PROMPTS_LEARNER,
      KeyConditionExpression: "#learnerId = :learnerId",
      ExpressionAttributeNames: {
        "#learnerId": "learnerId",
      },
      ExpressionAttributeValues: {
        ":learnerId": learnerId,
      },
    })
  );

  const favorites = (result.Items as FavoritePrompt[]) ?? [];

  return favorites.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addFavoritePrompt(
  learnerId: string,
  promptId: string
): Promise<FavoritePrompt> {
  const favorite: FavoritePrompt = {
    id: favoritePromptId(learnerId, promptId),
    learnerId,
    promptId,
    createdAt: new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: TableName.FAVORITE_PROMPTS,
      Item: favorite,
    })
  );

  return favorite;
}

export async function removeFavoritePrompt(
  learnerId: string,
  promptId: string
): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TableName.FAVORITE_PROMPTS,
      Key: { id: favoritePromptId(learnerId, promptId) },
    })
  );
}
