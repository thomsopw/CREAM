"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { ScenarioNode } from "./nodes/scenario-node";
import { FilterNode } from "./nodes/filter-node";
import { OperatorNode } from "./nodes/operator-node";
import type { AlgorithmDefinition } from "@/lib/algorithm-types";

const nodeTypes: NodeTypes = {
  scenario: ScenarioNode,
  filter: FilterNode,
  operator: OperatorNode,
};

function createNode(
  type: "scenario" | "filter" | "operator",
  id: string,
  x: number,
  y: number,
  data?: Record<string, unknown>
): Node {
  if (type === "scenario") {
    return {
      id,
      type: "scenario",
      position: { x, y },
      data: { scenarioId: data?.scenarioId ?? "" },
    };
  }
  if (type === "filter") {
    return {
      id,
      type: "filter",
      position: { x, y },
      data: {
        filterType: data?.filterType ?? "minReturn",
        value: data?.value ?? 10,
      },
    };
  }
  return {
    id,
    type: "operator",
    position: { x, y },
    data: { op: data?.op ?? "AND" },
  };
}

function definitionToFlow(def: AlgorithmDefinition): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let x = 50;
  let y = 50;

  for (const n of def.nodes) {
    if (n.type === "scenario") {
      nodes.push(
        createNode("scenario", n.id, x, y, { scenarioId: n.scenarioId })
      );
    } else if (n.type === "filter") {
      nodes.push(
        createNode("filter", n.id, x, y, {
          filterType: n.filterType,
          value: n.value,
        })
      );
    } else {
      nodes.push(createNode("operator", n.id, x, y, { op: n.op }));
    }
    x += 180;
    if (x > 500) {
      x = 50;
      y += 120;
    }
  }

  for (const e of def.edges) {
    edges.push({
      id: `${e.from}-${e.to}`,
      source: e.from,
      target: e.to,
    });
  }

  return { nodes, edges };
}

function flowToDefinition(
  nodes: Node[],
  edges: Edge[],
  outputNodeId: string
): AlgorithmDefinition {
  const defNodes: AlgorithmDefinition["nodes"] = [];
  for (const n of nodes) {
    if (n.type === "scenario" && n.data) {
      defNodes.push({
        id: n.id,
        type: "scenario",
        scenarioId: String((n.data as { scenarioId?: string }).scenarioId ?? ""),
      });
    } else if (n.type === "filter" && n.data) {
      const d = n.data as { filterType?: string; value?: unknown };
      defNodes.push({
        id: n.id,
        type: "filter",
        filterType: (d.filterType as "sector" | "minReturn" | "dateRange") ?? "minReturn",
        value: d.value as string | number | [string, string],
      });
    } else if (n.type === "operator" && n.data) {
      defNodes.push({
        id: n.id,
        type: "operator",
        op: ((n.data as { op?: string }).op as "AND" | "OR" | "NOT") ?? "AND",
      });
    }
  }
  const defEdges = edges.map((e) => ({ from: e.source, to: e.target }));
  return {
    nodes: defNodes,
    edges: defEdges,
    outputNodeId,
  };
}

const initialDefinition: AlgorithmDefinition = {
  nodes: [],
  edges: [],
  outputNodeId: "",
};

export function AlgorithmBuilder({
  initialDef = initialDefinition,
  onSave,
  onRunBacktest,
}: {
  initialDef?: AlgorithmDefinition;
  onSave?: (def: AlgorithmDefinition, name: string, description: string) => void;
  onRunBacktest?: (def: AlgorithmDefinition) => void;
}) {
  const [runResult, setRunResult] = useState<{
    trades: unknown[];
    metrics: unknown;
    equityCurve: unknown[];
  } | null>(null);
  const { nodes: initNodes, edges: initEdges } = definitionToFlow(initialDef);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [outputNodeId, setOutputNodeId] = useState(initialDef.outputNodeId || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );

  const addScenarioNode = useCallback(() => {
    const id = `scenario-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      createNode("scenario", id, 100 + nds.length * 30, 100 + nds.length * 30),
    ]);
    if (!outputNodeId) setOutputNodeId(id);
  }, [setNodes, outputNodeId]);

  const addFilterNode = useCallback(() => {
    const id = `filter-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      createNode("filter", id, 100 + nds.length * 30, 100 + nds.length * 30),
    ]);
    if (!outputNodeId) setOutputNodeId(id);
  }, [setNodes, outputNodeId]);

  const addOperatorNode = useCallback((op: "AND" | "OR" | "NOT") => {
    const id = `op-${op.toLowerCase()}-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      createNode("operator", id, 100 + nds.length * 30, 100 + nds.length * 30, {
        op,
      }),
    ]);
    if (!outputNodeId) setOutputNodeId(id);
  }, [setNodes, outputNodeId]);

  const handleSave = useCallback(() => {
    const def = flowToDefinition(nodes, edges, outputNodeId);
    if (outputNodeId && onSave) {
      onSave(def, name || "Untitled Algorithm", description);
    }
  }, [nodes, edges, outputNodeId, name, description, onSave]);

  const handleRun = useCallback(async () => {
    const def = flowToDefinition(nodes, edges, outputNodeId);
    if (!outputNodeId) return;
    if (onRunBacktest) {
      onRunBacktest(def);
      return;
    }
    try {
      const res = await fetch("/api/algorithms/backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ definition: def }),
      });
      if (res.ok) {
        const data = await res.json();
        setRunResult(data);
      }
    } catch {}
  }, [nodes, edges, outputNodeId, onRunBacktest]);

  return (
    <div className="flex h-[600px] flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        <span className="text-sm font-medium">Add:</span>
        <button
          onClick={addScenarioNode}
          className="rounded border border-border bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted"
        >
          Scenario
        </button>
        <button
          onClick={addFilterNode}
          className="rounded border border-border bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted"
        >
          Filter
        </button>
        <button
          onClick={() => addOperatorNode("AND")}
          className="rounded border border-border bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted"
        >
          AND
        </button>
        <button
          onClick={() => addOperatorNode("OR")}
          className="rounded border border-border bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted"
        >
          OR
        </button>
        <button
          onClick={() => addOperatorNode("NOT")}
          className="rounded border border-border bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted"
        >
          NOT
        </button>
        <span className="ml-4 text-sm text-muted-foreground">
          Output node:{" "}
          <select
            value={outputNodeId}
            onChange={(e) => setOutputNodeId(e.target.value)}
            className="rounded border border-input bg-background px-2 py-1 text-sm"
          >
            <option value="">Select...</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id}
              </option>
            ))}
          </select>
        </span>
      </div>

      <div className="flex-1 rounded-lg border border-border bg-muted/20">
        <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        </ReactFlowProvider>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {onSave && (
          <>
            <Input
              placeholder="Algorithm name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-xs"
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="max-w-xs"
            />
            <button
              onClick={handleSave}
              disabled={!outputNodeId}
              className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Save Algorithm
            </button>
          </>
        )}
        <button
          onClick={handleRun}
          disabled={!outputNodeId}
          className="rounded border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
        >
          Run Backtest
        </button>
        {runResult && (
          <div className="w-full rounded border border-border bg-muted/30 p-4">
            <p className="font-medium">Quick Results</p>
            <p className="text-sm text-muted-foreground">
              Trades: {(runResult as { metrics?: { tradeCount?: number } }).metrics?.tradeCount ?? 0},{" "}
              Win Rate: {(runResult as { metrics?: { winRate?: number } }).metrics?.winRate?.toFixed(1) ?? 0}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
