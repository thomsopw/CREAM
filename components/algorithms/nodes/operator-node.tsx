"use client";

import { memo } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "reactflow";

export const OperatorNode = memo(function OperatorNode({
  data,
  id,
}: NodeProps<{ op?: string }>) {
  const { setNodes } = useReactFlow();
  const op = data?.op ?? "AND";

  const updateData = (key: string, val: unknown) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, [key]: val } } : n
      )
    );
  };

  return (
    <div className="min-w-[120px] rounded-lg border border-border bg-card p-3 shadow">
      <Handle type="target" position={Position.Top} id="a" className="!h-2 !w-2" />
      {op !== "NOT" && (
        <Handle
          type="target"
          position={Position.Left}
          id="b"
          className="!h-2 !w-2"
          style={{ top: "50%" }}
        />
      )}
      <div className="mb-1 text-xs font-medium text-muted-foreground">
        Operator
      </div>
      <select
        value={op}
        onChange={(e) => updateData("op", e.target.value)}
        className="w-full rounded border border-input bg-background px-2 py-1.5 text-sm font-medium"
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
        <option value="NOT">NOT</option>
      </select>
      <Handle type="source" position={Position.Bottom} className="!h-2 !w-2" />
    </div>
  );
});
