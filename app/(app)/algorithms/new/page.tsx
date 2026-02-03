"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlgorithmBuilder } from "@/components/algorithms/algorithm-builder";
import type { AlgorithmDefinition } from "@/lib/algorithm-types";

export default function NewAlgorithmPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (
    def: AlgorithmDefinition,
    name: string,
    description: string
  ) => {
    setSaving(true);
    try {
      const res = await fetch("/api/algorithms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          definition: def,
        }),
      });
      if (res.ok) {
        const algo = await res.json();
        router.push(`/algorithms/${algo.id}`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/algorithms"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Algorithms
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Create Algorithm</h1>
        <p className="mt-2 text-muted-foreground">
          Build your strategy with scenario, filter, and operator nodes.
          Connect them and set the output node.
        </p>
      </div>

      <AlgorithmBuilder onSave={handleSave} />
    </div>
  );
}
