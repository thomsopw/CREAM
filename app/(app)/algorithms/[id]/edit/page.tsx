import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AlgorithmEditView } from "@/components/algorithms/algorithm-edit-view";

export default async function EditAlgorithmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const algo = await prisma.algorithm.findUnique({ where: { id } });

  if (!algo) notFound();
  if (algo.isPreset) {
    return (
      <div className="space-y-8">
        <div>
          <Link
            href="/algorithms"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Algorithms
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Edit Copy of {algo.name}</h1>
          <p className="mt-2 text-muted-foreground">
            Create your own copy to modify. Preset algorithms cannot be edited
            directly.
          </p>
        </div>
        <AlgorithmEditView
          algorithm={algo}
          isPreset={true}
          userId={session?.user?.id}
        />
      </div>
    );
  }

  if (algo.userId !== session?.user?.id) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/algorithms"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Algorithms
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Edit {algo.name}</h1>
      </div>
      <AlgorithmEditView
        algorithm={algo}
        isPreset={false}
        userId={session?.user?.id}
      />
    </div>
  );
}
