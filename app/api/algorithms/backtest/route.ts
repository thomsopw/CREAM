import { NextResponse } from "next/server";
import { getEventsWithImpacts } from "@/lib/data";
import { evaluateAlgorithm } from "@/lib/backtest";
import type { AlgorithmDefinition } from "@/lib/algorithm-types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { definition, startDate, endDate } = body;

  if (!definition) {
    return NextResponse.json(
      { error: "Definition is required" },
      { status: 400 }
    );
  }

  let dateRange: { start: string; end: string } | null = null;
  if (startDate && endDate) {
    dateRange = { start: startDate, end: endDate };
  }

  const def = definition as AlgorithmDefinition;
  const eventsWithContext = getEventsWithImpacts().map((e) => ({
    id: e.id,
    ticker: e.ticker,
    scenarioId: e.scenarioId,
    headline: e.headline,
    date: e.date,
    impacts: e.impacts,
    sector: e.company?.sector,
  }));

  const result = evaluateAlgorithm(def, eventsWithContext, dateRange);

  return NextResponse.json(result);
}
