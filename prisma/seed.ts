import { PrismaClient } from "@prisma/client";
import algorithmsData from "../data/seed/algorithms.json";

const prisma = new PrismaClient();

async function main() {
  const presetCount = await prisma.algorithm.count({
    where: { isPreset: true },
  });
  if (presetCount > 0) {
    console.log("Preset algorithms already exist, skipping seed.");
    return;
  }

  for (const algo of algorithmsData as Array<{
    name: string;
    description: string;
    definition: object;
  }>) {
    await prisma.algorithm.create({
      data: {
        name: algo.name,
        description: algo.description,
        definition: JSON.stringify(algo.definition),
        isPreset: true,
      },
    });
  }
  console.log(`Seeded ${algorithmsData.length} preset algorithms.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
