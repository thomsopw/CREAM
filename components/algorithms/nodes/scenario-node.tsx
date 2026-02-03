"use client";

import { memo } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "reactflow";
import { scenarios } from "@/lib/data";

export const ScenarioNode = memo(function ScenarioNode({
  data,
  id,
}: NodeProps<{ scenarioId?: string }>) {
  const { setNodes } = useReactFlow();
  const scenarioId = data?.scenarioId ?? "";

  const updateData = (key: string, value: unknown) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, [key]: value } } : n
      )
    );
  };

  return (
    <div className="min-w-[180px] rounded-lg border border-border bg-card p-3 shadow">
      <Handle type="target" position={Position.Top} className="!h-2 !w-2" />
      <div className="mb-2 text-xs font-medium text-muted-foreground">
        Scenario
      </div>
      <select
        value={scenarioId}
        onChange={(e) => updateData("scenarioId", e.target.value)}
        className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
      >
        <option value="">Select scenario...</option>
        {scenarios.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2" />
    </div>
  );
});
