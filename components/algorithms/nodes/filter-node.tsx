"use client";

import { memo } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "reactflow";

const filterTypes = [
  { value: "minReturn", label: "Min Return %" },
  { value: "sector", label: "Sector" },
  { value: "dateRange", label: "Date Range" },
];

export const FilterNode = memo(function FilterNode({
  data,
  id,
}: NodeProps<{ filterType?: string; value?: unknown }>) {
  const { setNodes } = useReactFlow();
  const filterType = data?.filterType ?? "minReturn";
  const value = data?.value;

  const updateData = (key: string, val: unknown) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, [key]: val } } : n
      )
    );
  };

  return (
    <div className="min-w-[180px] rounded-lg border border-border bg-card p-3 shadow">
      <Handle type="target" position={Position.Top} className="!h-2 !w-2" />
      <div className="mb-2 text-xs font-medium text-muted-foreground">
        Filter
      </div>
      <select
        value={filterType}
        onChange={(e) => updateData("filterType", e.target.value)}
        className="mb-2 w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
      >
        {filterTypes.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      {filterType === "minReturn" && (
        <input
          type="number"
          defaultValue={typeof value === "number" ? value : 10}
          onChange={(e) =>
            updateData("value", parseFloat(e.target.value || "0"))
          }
          className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
          placeholder="e.g. 15"
        />
      )}
      {filterType === "sector" && (
        <input
          type="text"
          defaultValue={
            Array.isArray(value) ? value.join(", ") : String(value ?? "")
          }
          onChange={(e) => {
            const v = e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            updateData("value", v);
          }}
          className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm"
          placeholder="Healthcare, Technology"
        />
      )}
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2" />
    </div>
  );
});
