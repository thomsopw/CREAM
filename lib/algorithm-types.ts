export type AlgorithmNode =
  | { id: string; type: "scenario"; scenarioId: string }
  | {
      id: string;
      type: "filter";
      filterType: "sector" | "minReturn" | "dateRange";
      value: string | number | [string, string];
    }
  | { id: string; type: "operator"; op: "AND" | "OR" | "NOT" };

export interface AlgorithmDefinition {
  nodes: AlgorithmNode[];
  edges: Array<{ from: string; to: string }>;
  outputNodeId: string;
  weights?: Record<string, number>;
}

export interface BacktestTrade {
  eventId: string;
  ticker: string;
  scenarioId: string;
  headline: string;
  date: string;
  return1d: number;
  return1w: number;
  return1m: number;
}

export interface BacktestMetrics {
  tradeCount: number;
  winRate: number;
  avgReturn1d: number;
  avgReturn1w: number;
  avgReturn1m: number;
  cumulativeReturn: number;
}

export interface BacktestResult {
  trades: BacktestTrade[];
  metrics: BacktestMetrics;
  equityCurve: Array<{ date: string; cumulative: number }>;
}
