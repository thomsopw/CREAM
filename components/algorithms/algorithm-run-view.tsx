"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BacktestResultsChart } from "@/components/charts/backtest-results-chart";

type BacktestResult = {
  trades: Array<{
    eventId: string;
    ticker: string;
    scenarioId: string;
    headline: string;
    date: string;
    return1d: number;
    return1w: number;
    return1m: number;
  }>;
  metrics: {
    tradeCount: number;
    winRate: number;
    avgReturn1d: number;
    avgReturn1w: number;
    avgReturn1m: number;
    cumulativeReturn: number;
  };
  equityCurve: Array<{ date: string; cumulative: number }>;
};

export function AlgorithmRunView({
  algorithmId,
  algorithmName,
}: {
  algorithmId: string;
  algorithmName: string;
}) {
  const [startDate, setStartDate] = useState("2024-08-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/algorithms/${algorithmId}/backtest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Run Backtest</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a date range and run the algorithm against historical events.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button onClick={handleRun} disabled={loading}>
            {loading ? "Running..." : "Run Backtest"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Metrics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Backtest results for selected period
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                <div>
                  <p className="text-sm text-muted-foreground">Trades</p>
                  <p className="text-2xl font-bold">{result.metrics.tradeCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">
                    {result.metrics.winRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg 1d Return</p>
                  <p
                    className={`text-2xl font-bold ${
                      result.metrics.avgReturn1d >= 0
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {(result.metrics.avgReturn1d >= 0 ? "+" : "")}
                    {result.metrics.avgReturn1d.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg 1w Return</p>
                  <p
                    className={`text-2xl font-bold ${
                      result.metrics.avgReturn1w >= 0
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {(result.metrics.avgReturn1w >= 0 ? "+" : "")}
                    {result.metrics.avgReturn1w.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg 1m Return</p>
                  <p
                    className={`text-2xl font-bold ${
                      result.metrics.avgReturn1m >= 0
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {(result.metrics.avgReturn1m >= 0 ? "+" : "")}
                    {result.metrics.avgReturn1m.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cumulative</p>
                  <p
                    className={`text-2xl font-bold ${
                      result.metrics.cumulativeReturn >= 0
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {(result.metrics.cumulativeReturn >= 0 ? "+" : "")}
                    {result.metrics.cumulativeReturn.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.equityCurve.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Simulated growth (starting at 100)
                </p>
              </CardHeader>
              <CardContent>
                <BacktestResultsChart data={result.equityCurve} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Matched Trades</CardTitle>
              <p className="text-sm text-muted-foreground">
                {result.trades.length} events matched the algorithm
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 text-left text-sm font-medium">
                        Date
                      </th>
                      <th className="py-2 text-left text-sm font-medium">
                        Ticker
                      </th>
                      <th className="py-2 text-left text-sm font-medium">
                        Headline
                      </th>
                      <th className="py-2 text-right text-sm font-medium">
                        1d
                      </th>
                      <th className="py-2 text-right text-sm font-medium">
                        1w
                      </th>
                      <th className="py-2 text-right text-sm font-medium">
                        1m
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trades.map((t) => (
                      <tr
                        key={t.eventId}
                        className="border-b border-border/60"
                      >
                        <td className="py-2 text-sm">{t.date}</td>
                        <td className="py-2">
                          <Link
                            href={`/companies/${t.ticker}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {t.ticker}
                          </Link>
                        </td>
                        <td className="max-w-xs truncate py-2 text-sm">
                          {t.headline}
                        </td>
                        <td
                          className={`py-2 text-right text-sm ${
                            t.return1d >= 0 ? "text-primary" : "text-destructive"
                          }`}
                        >
                          {(t.return1d >= 0 ? "+" : "")}
                          {t.return1d}%
                        </td>
                        <td
                          className={`py-2 text-right text-sm ${
                            t.return1w >= 0 ? "text-primary" : "text-destructive"
                          }`}
                        >
                          {(t.return1w >= 0 ? "+" : "")}
                          {t.return1w}%
                        </td>
                        <td
                          className={`py-2 text-right text-sm ${
                            t.return1m >= 0 ? "text-primary" : "text-destructive"
                          }`}
                        >
                          {(t.return1m >= 0 ? "+" : "")}
                          {t.return1m}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
