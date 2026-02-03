import type {
  AlgorithmDefinition,
  AlgorithmNode,
  BacktestResult,
} from "./algorithm-types";

type EventWithContext = {
  id: string;
  ticker: string;
  scenarioId: string;
  headline: string;
  date: string;
  impacts?: { return1d: number; return1w: number; return1m: number };
  sector?: string;
};

function getNodeById(def: AlgorithmDefinition, id: string): AlgorithmNode | undefined {
  return def.nodes.find((n) => n.id === id);
}

function getIncomingNodes(def: AlgorithmDefinition, nodeId: string): AlgorithmNode[] {
  const incomingEdges = def.edges.filter((e) => e.to === nodeId);
  const nodes: AlgorithmNode[] = [];
  for (const edge of incomingEdges) {
    const node = getNodeById(def, edge.from);
    if (node) nodes.push(node);
  }
  return nodes;
}

function evaluateNode(
  def: AlgorithmDefinition,
  node: AlgorithmNode,
  event: EventWithContext,
  dateRange: { start: string; end: string } | null
): boolean {
  if (node.type === "scenario") {
    return event.scenarioId === node.scenarioId;
  }

  if (node.type === "filter") {
    if (node.filterType === "sector") {
      const raw = node.value;
      const sectors = Array.isArray(raw)
        ? raw
        : typeof raw === "string"
          ? raw.split(",").map((s) => s.trim()).filter(Boolean)
          : [String(raw)];
      return sectors.some(
        (s) => event.sector?.toLowerCase() === String(s).toLowerCase()
      );
    }
    if (node.filterType === "minReturn") {
      const min = Number(node.value);
      const ret = event.impacts?.return1m ?? 0;
      return ret >= min;
    }
    if (node.filterType === "dateRange") {
      if (!dateRange) return true;
      const eventDate = event.date;
      return eventDate >= dateRange.start && eventDate <= dateRange.end;
    }
    return false;
  }

  if (node.type === "operator") {
    const inputs = getIncomingNodes(def, node.id);
    const inputResults = inputs.map((inNode) =>
      evaluateNode(def, inNode, event, dateRange)
    );

    if (node.op === "AND") {
      return inputResults.every(Boolean);
    }
    if (node.op === "OR") {
      return inputResults.some(Boolean);
    }
    if (node.op === "NOT") {
      return !inputResults[0];
    }
  }

  return false;
}

export function evaluateAlgorithm(
  definition: AlgorithmDefinition,
  events: EventWithContext[],
  dateRange?: { start: string; end: string } | null
): BacktestResult {
  const range = dateRange ?? null;
  const trades: BacktestResult["trades"] = [];

  const filteredEvents = range
    ? events.filter(
        (e) => e.date >= range.start && e.date <= range.end
      )
    : events;

  for (const event of filteredEvents) {
    if (!event.impacts) continue;

    const outputNode = getNodeById(definition, definition.outputNodeId);
    if (!outputNode) continue;

    const matches = evaluateNode(definition, outputNode, event, range);
    if (matches) {
      trades.push({
        eventId: event.id,
        ticker: event.ticker,
        scenarioId: event.scenarioId,
        headline: event.headline,
        date: event.date,
        return1d: event.impacts.return1d,
        return1w: event.impacts.return1w,
        return1m: event.impacts.return1m,
      });
    }
  }

  trades.sort((a, b) => a.date.localeCompare(b.date));

  const winCount = trades.filter((t) => t.return1m > 0).length;
  const tradeCount = trades.length;
  const winRate = tradeCount > 0 ? (winCount / tradeCount) * 100 : 0;
  const avgReturn1d =
    tradeCount > 0 ? trades.reduce((s, t) => s + t.return1d, 0) / tradeCount : 0;
  const avgReturn1w =
    tradeCount > 0 ? trades.reduce((s, t) => s + t.return1w, 0) / tradeCount : 0;
  const avgReturn1m =
    tradeCount > 0 ? trades.reduce((s, t) => s + t.return1m, 0) / tradeCount : 0;

  let cumulative = 100;
  const equityCurve: Array<{ date: string; cumulative: number }> = [
    { date: trades[0]?.date ?? "", cumulative: 100 },
  ];
  for (const t of trades) {
    cumulative *= 1 + t.return1m / 100;
    equityCurve.push({ date: t.date, cumulative });
  }
  const cumulativeReturn = cumulative - 100;

  return {
    trades,
    metrics: {
      tradeCount,
      winRate,
      avgReturn1d,
      avgReturn1w,
      avgReturn1m,
      cumulativeReturn,
    },
    equityCurve,
  };
}
