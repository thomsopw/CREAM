import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scenarios } from "@/lib/data";

export default function ScenariosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Scenarios</h1>
        <p className="mt-2 text-muted-foreground">
          Event types with historical performance data. Select one to explore.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <Link key={scenario.id} href={`/scenarios/${scenario.id}`}>
            <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/20">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{scenario.name}</h3>
                  <Badge variant="success">{scenario.winRate}% win</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {scenario.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">1d: </span>
                    <span
                      className={
                        (scenario.avgReturn1d ?? 0) >= 0
                          ? "text-primary"
                          : "text-destructive"
                      }
                    >
                      {(scenario.avgReturn1d ?? 0) >= 0 ? "+" : ""}
                      {scenario.avgReturn1d}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">1w: </span>
                    <span
                      className={
                        (scenario.avgReturn1w ?? 0) >= 0
                          ? "text-primary"
                          : "text-destructive"
                      }
                    >
                      {(scenario.avgReturn1w ?? 0) >= 0 ? "+" : ""}
                      {scenario.avgReturn1w}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">1m: </span>
                    <span
                      className={
                        (scenario.avgReturn1m ?? 0) >= 0
                          ? "text-primary"
                          : "text-destructive"
                      }
                    >
                      {(scenario.avgReturn1m ?? 0) >= 0 ? "+" : ""}
                      {scenario.avgReturn1m}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
