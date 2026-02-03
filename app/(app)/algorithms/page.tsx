import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

async function ensurePresets() {
  const count = await prisma.algorithm.count({ where: { isPreset: true } });
  if (count === 0) {
    const { PrismaClient } = await import("@prisma/client");
    const algorithmsData = (await import("@/data/seed/algorithms.json")).default;
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
  }
}

export default async function AlgorithmsPage() {
  await ensurePresets();
  const session = await getServerSession(authOptions);

  const presets = await prisma.algorithm.findMany({
    where: { isPreset: true },
    orderBy: { name: "asc" },
  });

  let userAlgos: typeof presets = [];
  if (session?.user?.id) {
    userAlgos = await prisma.algorithm.findMany({
      where: { userId: session.user.id, isPreset: false },
      orderBy: { updatedAt: "desc" },
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Algorithms</h1>
          <p className="mt-2 text-muted-foreground">
            Run preset strategies or create your own. Test profitability against
            historical event data.
          </p>
        </div>
        <Button asChild>
          <Link href="/algorithms/new">Create Algorithm</Link>
        </Button>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Preset Algorithms</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {presets.map((algo) => (
            <Card key={algo.id}>
              <CardHeader className="pb-2">
                <h3 className="font-semibold">{algo.name}</h3>
                {algo.description && (
                  <p className="text-sm text-muted-foreground">
                    {algo.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button variant="default" size="sm" asChild>
                  <Link href={`/algorithms/${algo.id}`}>Run</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/algorithms/${algo.id}/edit`}>Edit Copy</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {userAlgos.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Your Algorithms</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userAlgos.map((algo) => (
              <Card key={algo.id}>
                <CardHeader className="pb-2">
                  <h3 className="font-semibold">{algo.name}</h3>
                  {algo.description && (
                    <p className="text-sm text-muted-foreground">
                      {algo.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/algorithms/${algo.id}`}>Run</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/algorithms/${algo.id}/edit`}>Edit</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
