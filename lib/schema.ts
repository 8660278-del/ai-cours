import {
  type KeySchemaElement,
  type AttributeDefinition,
  type GlobalSecondaryIndex,
} from "@aws-sdk/client-dynamodb";

export const TableName = {
  SERVICES: "services",
  PROGRESS: "progress",
  PERSONAL_PROMPTS: "personal_prompts",
  FAVORITE_PROMPTS: "favorite_prompts",
} as const;

export type TableName = (typeof TableName)[keyof typeof TableName];

export interface TableSchema {
  name: TableName;
  keySchema: KeySchemaElement[];
  attributeDefinitions: AttributeDefinition[];
  globalSecondaryIndexes?: GlobalSecondaryIndex[];
}

export const TABLE_SCHEMAS: Record<TableName, TableSchema> = {
  [TableName.SERVICES]: {
    name: TableName.SERVICES,
    keySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    attributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
      { AttributeName: "status", AttributeType: "S" },
    ],
    globalSecondaryIndexes: [
      {
        IndexName: "status-index",
        KeySchema: [{ AttributeName: "status", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  },
  [TableName.PROGRESS]: {
    name: TableName.PROGRESS,
    keySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    attributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  },
  [TableName.PERSONAL_PROMPTS]: {
    name: TableName.PERSONAL_PROMPTS,
    keySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    attributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
      { AttributeName: "learnerId", AttributeType: "S" },
    ],
    globalSecondaryIndexes: [
      {
        IndexName: "learnerId-index",
        KeySchema: [{ AttributeName: "learnerId", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  },
  [TableName.FAVORITE_PROMPTS]: {
    name: TableName.FAVORITE_PROMPTS,
    keySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    attributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
      { AttributeName: "learnerId", AttributeType: "S" },
    ],
    globalSecondaryIndexes: [
      {
        IndexName: "learnerId-index",
        KeySchema: [{ AttributeName: "learnerId", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  },
};

export const TABLE_NAMES: TableName[] = Object.values(TableName);

export const IndexName = {
  SERVICES_STATUS: "status-index",
  PERSONAL_PROMPTS_LEARNER: "learnerId-index",
  FAVORITE_PROMPTS_LEARNER: "learnerId-index",
} as const;

export type IndexName = (typeof IndexName)[keyof typeof IndexName];
