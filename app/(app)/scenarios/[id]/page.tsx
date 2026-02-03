import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScenarioReturnsChart } from "@/components/charts/scenario-returns-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getScenarioById,
  getEventsForScenario,
  eventImpacts,
} from "@/lib/data";

export default async function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario = getScenarioById(id);
  if (!scenario) notFound();

  const events = getEventsForScenario(id);
  const eventsWithImpacts = events
    .map((evt) => ({
      ...evt,
      impacts: eventImpacts[evt.id],
    }))
    .filter((e) => e.impacts)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const chartData = [
    { period: "1 Day", avg: scenario.avgReturn1d, sp500: scenario.sp500Comparison },
    { period: "1 Week", avg: scenario.avgReturn1w, sp500: scenario.sp500Comparison },
    { period: "1 Month", avg: scenario.avgReturn1m, sp500: scenario.sp500Comparison },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/scenarios"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Scenarios
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{scenario.name}</h1>
          <p className="mt-2 text-muted-foreground">{scenario.description}</p>
        </div>
        <Badge variant="success" className="text-sm">
          {scenario.winRate}% win rate
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Average Returns by Horizon</CardTitle>
            <p className="text-sm text-muted-foreground">
              vs S&P 500 comparison
            </p>
          </CardHeader>
          <CardContent>
            <ScenarioReturnsChart data={chartData} />
            <div className="mt-4 flex gap-6">
              <div>
                <span className="text-sm text-muted-foreground">1 Day: </span>
                <span
                  className={
                    (scenario.avgReturn1d ?? 0) >= 0
                      ? "font-medium text-primary"
                      : "font-medium text-destructive"
                  }
                >
                  {(scenario.avgReturn1d ?? 0) >= 0 ? "+" : ""}
                  {scenario.avgReturn1d}%
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">1 Week: </span>
                <span
                  className={
                    (scenario.avgReturn1w ?? 0) >= 0
                      ? "font-medium text-primary"
                      : "font-medium text-destructive"
                  }
                >
                  {(scenario.avgReturn1w ?? 0) >= 0 ? "+" : ""}
                  {scenario.avgReturn1w}%
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">1 Month: </span>
                <span
                  className={
                    (scenario.avgReturn1m ?? 0) >= 0
                      ? "font-medium text-primary"
                      : "font-medium text-destructive"
                  }
                >
                  {(scenario.avgReturn1m ?? 0) >= 0 ? "+" : ""}
                  {scenario.avgReturn1m}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <p className="text-sm text-muted-foreground">
              {eventsWithImpacts.length} events in this scenario
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {eventsWithImpacts.slice(0, 10).map((evt) => (
                <Link
                  key={evt.id}
                  href={`/companies/${evt.ticker}`}
                  className="block rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{evt.ticker}</span>
                    {evt.impacts && (
                      <div className="flex gap-2 text-sm">
                        <span
                          className={
                            evt.impacts.return1d >= 0
                              ? "text-primary"
                              : "text-destructive"
                          }
                        >
                          {evt.impacts.return1d >= 0 ? "+" : ""}
                          {evt.impacts.return1d}%
                        </span>
                        <span className="text-muted-foreground">1d</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {evt.headline}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(evt.date).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/events">View all events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
