import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { scenarios, getEventsWithImpacts } from "@/lib/data";

export default async function DashboardPage() {
  const eventsWithImpacts = getEventsWithImpacts();
  const recentEvents = eventsWithImpacts.slice(0, 5);
  const presetAlgorithms = await prisma.algorithm.findMany({
    where: { isPreset: true },
    take: 4,
    orderBy: { name: "asc" },
  });
  const topScenarios = scenarios
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Your event-driven research hub
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Events</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/events">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((evt) => (
                <Link
                  key={evt.id}
                  href={`/companies/${evt.ticker}`}
                  className="block rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{evt.ticker}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {evt.scenario?.name}
                      </span>
                    </div>
                    {evt.impacts && (
                      <div className="text-right text-sm">
                        <span className="text-primary">
                          +{evt.impacts.return1d}%
                        </span>
                        <span className="ml-2 text-muted-foreground">1d</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {evt.headline}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Scenarios by Win Rate</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/scenarios">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topScenarios.map((s) => (
                <Link
                  key={s.id}
                  href={`/scenarios/${s.id}`}
                  className="flex items-center justify-between rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/30"
                >
                  <div>
                    <span className="font-medium">{s.name}</span>
                    <p className="text-sm text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-primary">{s.winRate}%</span>
                    <span className="block text-xs text-muted-foreground">
                      win rate
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Preset Algorithms</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/algorithms">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {presetAlgorithms.map((algo) => (
                <Link
                  key={algo.id}
                  href={`/algorithms/${algo.id}`}
                  className="flex items-center justify-between rounded-lg border border-border/60 p-4 transition-colors hover:bg-muted/30"
                >
                  <div>
                    <span className="font-medium">{algo.name}</span>
                    {algo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {algo.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-primary">Run</span>
                </Link>
              ))}
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
