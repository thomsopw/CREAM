import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventImpactChart } from "@/components/charts/event-impact-chart";
import { Badge } from "@/components/ui/badge";
import { AddToWatchlistButton } from "@/components/watchlist/add-to-watchlist-button";
import {
  getCompanyByTicker,
  getEventsForTicker,
  eventImpacts,
  getScenarioById,
} from "@/lib/data";

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const company = getCompanyByTicker(ticker.toUpperCase());
  if (!company) notFound();

  const events = getEventsForTicker(company.ticker);
  const eventsWithImpacts = events
    .map((evt) => ({
      ...evt,
      impacts: eventImpacts[evt.id],
      scenario: getScenarioById(evt.scenarioId),
    }))
    .filter((e) => e.impacts)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const chartData = eventsWithImpacts.slice(0, 10).reverse().map((evt) => ({
    date: new Date(evt.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    return: evt.impacts?.return1m ?? 0,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/events"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Events
          </Link>
          <h1 className="mt-2 text-3xl font-bold">{company.ticker}</h1>
          <p className="mt-1 text-lg text-muted-foreground">{company.name}</p>
          <Badge variant="secondary" className="mt-2">
            {company.sector}
          </Badge>
        </div>
        <AddToWatchlistButton ticker={company.ticker} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Impact History</CardTitle>
            <p className="text-sm text-muted-foreground">
              1-month returns following detected events
            </p>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <EventImpactChart data={chartData} />
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                No event data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <p className="text-sm text-muted-foreground">
              {eventsWithImpacts.length} events detected
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {eventsWithImpacts.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-lg border border-border/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{evt.scenario?.name}</Badge>
                    {evt.impacts && (
                      <div className="flex gap-2 text-sm">
                        <span
                          className={
                            evt.impacts.return1m >= 0
                              ? "text-primary"
                              : "text-destructive"
                          }
                        >
                          {evt.impacts.return1m >= 0 ? "+" : ""}
                          {evt.impacts.return1m}%
                        </span>
                        <span className="text-muted-foreground">1m</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm">{evt.headline}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(evt.date).toLocaleDateString()} · {evt.source}
                  </p>
                </div>
              ))}
              {eventsWithImpacts.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                  No events found for this company
                </p>
              )}
            </div>
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
