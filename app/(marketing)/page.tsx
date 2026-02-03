import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              AI Finds The Best Stocks{" "}
              <span className="text-primary">1800X Faster</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              AI scans for events proven to impact stock prices, so you
              don&apos;t have to. Event-driven research for self-directed
              investors.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Get Started Free
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props - How It Works */}
      <section className="border-b border-border/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">
            Effortless Stock Analysis & Event-driven Trading
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Three simple steps to uncover opportunities
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="border-border/60">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle>Select Event Type</CardTitle>
                <CardDescription>
                  Choose from return of capital, government actions, restructuring,
                  activist investors, and 20+ other proven catalysts.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/60">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle>View Price Reactions</CardTitle>
                <CardDescription>
                  Use event patterns to determine buy and sell points. Win rates,
                  average returns, and historical performance.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border/60">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle>Set Event Alerts</CardTitle>
                <CardDescription>
                  Let the AI deliver opportunities to your inbox based on your
                  desired profit thresholds.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Alerts Preview */}
      <section className="border-b border-border/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">
            Recent Event-driven Trade Alerts
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Stock price performance post event
          </p>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 text-left text-sm font-medium text-muted-foreground">STOCK</th>
                  <th className="py-4 text-left text-sm font-medium text-muted-foreground">EVENT</th>
                  <th className="py-4 text-right text-sm font-medium text-muted-foreground">1 DAY</th>
                  <th className="py-4 text-right text-sm font-medium text-muted-foreground">1 WEEK</th>
                  <th className="py-4 text-right text-sm font-medium text-muted-foreground">1 MONTH</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { ticker: "NXGL", name: "Nexgel", event: "Return of Capital", d1: 22.5, w1: 36.7, m1: 18.5 },
                  { ticker: "GOTU", name: "Gaotu Techedu", event: "Return of Capital", d1: 1.8, w1: 20.8, m1: 140.2 },
                  { ticker: "MDIA", name: "MediaCo Holdings", event: "Return of Capital", d1: 18.3, w1: 14.5, m1: 37.9 },
                  { ticker: "ISEE", name: "Iveric Bio", event: "Government Actions", d1: 25.6, w1: 28.7, m1: 34.1 },
                  { ticker: "W", name: "Wayfair", event: "Restructuring", d1: 21.0, w1: 42.0, m1: 33.0 },
                ].map((row) => (
                  <tr key={row.ticker} className="border-b border-border/60 hover:bg-muted/30">
                    <td className="py-4">
                      <div>
                        <span className="font-medium">{row.ticker}</span>
                        <div className="text-sm text-muted-foreground">{row.name}</div>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">{row.event}</td>
                    <td className="py-4 text-right font-medium text-primary">+{row.d1}%</td>
                    <td className="py-4 text-right font-medium text-primary">+{row.w1}%</td>
                    <td className="py-4 text-right font-medium text-primary">+{row.m1}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/auth/signup">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">
            Join now and get access to all scenarios
          </h2>
          <p className="mt-4 text-muted-foreground">
            Over 100 actionable trading strategies, unlimited alerts, and weekly insights.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            This is not financial advice. Past performance does not guarantee future results.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm text-muted-foreground">
              © Cream. Event-driven stock research.
            </span>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
