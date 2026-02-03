import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getEventsWithImpacts } from "@/lib/data";
import { evaluateAlgorithm } from "@/lib/backtest";
import type { AlgorithmDefinition } from "@/lib/algorithm-types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const algo = await prisma.algorithm.findUnique({ where: { id } });
  if (!algo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const { startDate, endDate } = body;

  let dateRange: { start: string; end: string } | null = null;
  if (startDate && endDate) {
    dateRange = { start: startDate, end: endDate };
  }

  const definition = JSON.parse(algo.definition) as AlgorithmDefinition;
  const eventsWithContext = getEventsWithImpacts().map((e) => ({
    id: e.id,
    ticker: e.ticker,
    scenarioId: e.scenarioId,
    headline: e.headline,
    date: e.date,
    impacts: e.impacts,
    sector: e.company?.sector,
  }));

  const result = evaluateAlgorithm(definition, eventsWithContext, dateRange);

  return NextResponse.json(result);
}
