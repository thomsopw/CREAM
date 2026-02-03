import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AlgorithmRunView } from "@/components/algorithms/algorithm-run-view";

export default async function AlgorithmRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const algo = await prisma.algorithm.findUnique({ where: { id } });
  if (!algo) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/algorithms"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Algorithms
        </Link>
        <h1 className="mt-2 text-3xl font-bold">{algo.name}</h1>
        {algo.description && (
          <p className="mt-2 text-muted-foreground">{algo.description}</p>
        )}
      </div>

      <AlgorithmRunView algorithmId={algo.id} algorithmName={algo.name} />

      <p className="text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
