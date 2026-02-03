"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type WatchlistItem = {
  id: string;
  ticker: string;
  name: string | null;
  company?: { ticker: string; name: string; sector: string };
  recentEvents: Array<{
    id: string;
    ticker: string;
    headline: string;
    scenarioId: string;
    scenario?: { name: string };
    impacts?: { return1d: number };
  }>;
};

type EventWithImpacts = {
  id: string;
  ticker: string;
  headline: string;
  scenarioId: string;
  scenario?: { name: string };
  impacts?: { return1d: number; return1w: number; return1m: number };
};

export function WatchlistView({
  watchlist,
  events,
}: {
  watchlist: WatchlistItem[];
  events: EventWithImpacts[];
}) {
  const [tickerToAdd, setTickerToAdd] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!tickerToAdd.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: tickerToAdd.trim().toUpperCase() }),
      });
      if (res.ok) {
        setTickerToAdd("");
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(ticker: string) {
    try {
      await fetch("/api/watchlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      window.location.reload();
    } catch {}
  }

  if (watchlist.length === 0 && events.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Your watchlist is empty. Add tickers to track events.
          </p>
          <form onSubmit={handleAdd} className="mt-6 flex max-w-sm gap-2 mx-auto">
            <Input
              placeholder="e.g. AAPL"
              value={tickerToAdd}
              onChange={(e) => setTickerToAdd(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="Add ticker (e.g. AAPL)"
          value={tickerToAdd}
          onChange={(e) => setTickerToAdd(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit" disabled={loading}>
          Add to Watchlist
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {watchlist.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Link
                href={`/companies/${item.ticker}`}
                className="font-semibold text-primary hover:underline"
              >
                {item.ticker}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleRemove(item.ticker)}
              >
                Remove
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.company?.name ?? item.name ?? "-"}
              </p>
              {item.company?.sector && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.company.sector}
                </p>
              )}
              {item.recentEvents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium">Recent events</p>
                  {item.recentEvents.map((evt) => (
                    <Link
                      key={evt.id}
                      href={`/companies/${evt.ticker}`}
                      className="block rounded border border-border/60 p-2 text-sm hover:bg-muted/30"
                    >
                      <span className="text-muted-foreground">
                        {evt.scenario?.name}:
                      </span>{" "}
                      {evt.headline.slice(0, 50)}...
                      {evt.impacts && (
                        <span
                          className={
                            evt.impacts.return1d >= 0
                              ? "ml-1 text-primary"
                              : "ml-1 text-destructive"
                          }
                        >
                          {evt.impacts.return1d >= 0 ? "+" : ""}
                          {evt.impacts.return1d}%
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
