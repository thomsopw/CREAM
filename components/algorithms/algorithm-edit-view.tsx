"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlgorithmBuilder } from "@/components/algorithms/algorithm-builder";
import type { AlgorithmDefinition } from "@/lib/algorithm-types";

type Algorithm = {
  id: string;
  name: string;
  description: string | null;
  definition: string;
  isPreset: boolean;
};

export function AlgorithmEditView({
  algorithm,
  isPreset,
  userId,
}: {
  algorithm: Algorithm;
  isPreset: boolean;
  userId?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const initialDef = JSON.parse(algorithm.definition) as AlgorithmDefinition;

  const handleSave = async (
    def: AlgorithmDefinition,
    name: string,
    description: string
  ) => {
    if (isPreset) {
      setSaving(true);
      try {
        const res = await fetch("/api/algorithms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || `${algorithm.name} (Copy)`,
            description: description || algorithm.description,
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
    } else {
      setSaving(true);
      try {
        const res = await fetch(`/api/algorithms/${algorithm.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || algorithm.name,
            description: description ?? algorithm.description,
            definition: def,
          }),
        });
        if (res.ok) {
          router.push(`/algorithms/${algorithm.id}`);
        }
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <AlgorithmBuilder
      initialDef={initialDef}
      onSave={userId ? handleSave : undefined}
    />
  );
}
