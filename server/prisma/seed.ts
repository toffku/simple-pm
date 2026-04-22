import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type SeedItem = Record<string, unknown> & { id?: number };
type ModelUniqueFieldConfig = {
  field: string;
};

const uniqueFieldByModel: Record<string, ModelUniqueFieldConfig> = {
  team: { field: "teamName" },
  user: { field: "cognitoId" },
};

function getModelClient(modelName: string): any {
  const model = prisma[modelName as keyof typeof prisma];
  if (!model) {
    throw new Error(`Model "${modelName}" does not exist on Prisma client.`);
  }
  return model;
}

async function upsertFromFile(filePath: string) {
  const fileName = path.basename(filePath);
  const modelName = path.basename(fileName, path.extname(fileName));
  const model = getModelClient(modelName);
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8")) as SeedItem[];

  if (!Array.isArray(jsonData)) {
    throw new Error(`Seed data in "${fileName}" must be an array.`);
  }

  for (const row of jsonData) {
    const { id, ...rest } = row;
    const uniqueFieldConfig = uniqueFieldByModel[modelName];

    if (typeof id === "number") {
      await model.upsert({
        where: { id },
        update: rest,
        create: row,
      });
      continue;
    }

    if (uniqueFieldConfig) {
      const uniqueFieldValue = row[uniqueFieldConfig.field];
      if (typeof uniqueFieldValue !== "string" && typeof uniqueFieldValue !== "number") {
        throw new Error(
          `Each item in "${fileName}" must include "${uniqueFieldConfig.field}" for upsert.`
        );
      }

      await model.upsert({
        where: { [uniqueFieldConfig.field]: uniqueFieldValue },
        update: rest,
        create: row,
      });
      continue;
    }

    throw new Error(
      `Each item in "${fileName}" must include numeric "id" or a configured unique field.`
    );
  }

  console.log(`Upserted ${jsonData.length} rows into ${modelName}`);
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");
  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    await upsertFromFile(filePath);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
