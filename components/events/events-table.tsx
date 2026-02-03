"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

type EventWithImpacts = {
  id: string;
  ticker: string;
  scenarioId: string;
  date: string;
  headline: string;
  source: string;
  impacts?: { return1d: number; return1w: number; return1m: number };
  company?: { ticker: string; name: string; sector: string };
  scenario?: { id: string; name: string };
};

export function EventsTable({ events }: { events: EventWithImpacts[] }) {
  const [search, setSearch] = useState("");
  const [scenarioFilter, setScenarioFilter] = useState<string>("");

  const scenarios = useMemo(() => {
    const s = new Set(events.map((e) => e.scenario?.name).filter(Boolean));
    return Array.from(s).sort() as string[];
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((evt) => {
      const matchSearch =
        !search ||
        evt.ticker.toLowerCase().includes(search.toLowerCase()) ||
        evt.headline.toLowerCase().includes(search.toLowerCase()) ||
        evt.company?.name?.toLowerCase().includes(search.toLowerCase());
      const matchScenario =
        !scenarioFilter || evt.scenario?.name === scenarioFilter;
      return matchSearch && matchScenario;
    });
  }, [events, search, scenarioFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by ticker, company, or headline..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={scenarioFilter}
          onChange={(e) => setScenarioFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">All scenarios</option>
          {scenarios.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Event</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-right text-sm font-medium">1 Day</th>
              <th className="px-4 py-3 text-right text-sm font-medium">1 Week</th>
              <th className="px-4 py-3 text-right text-sm font-medium">1 Month</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((evt) => (
              <tr
                key={evt.id}
                className="border-b border-border/60 transition-colors hover:bg-muted/20"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/companies/${evt.ticker}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {evt.ticker}
                  </Link>
                  {evt.company && (
                    <div className="text-sm text-muted-foreground">
                      {evt.company.name}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm">{evt.scenario?.name ?? evt.scenarioId}</span>
                  <div className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
                    {evt.headline}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(evt.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {evt.impacts ? (
                    <span
                      className={
                        evt.impacts.return1d >= 0
                          ? "font-medium text-primary"
                          : "font-medium text-destructive"
                      }
                    >
                      {evt.impacts.return1d >= 0 ? "+" : ""}
                      {evt.impacts.return1d}%
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {evt.impacts ? (
                    <span
                      className={
                        evt.impacts.return1w >= 0
                          ? "font-medium text-primary"
                          : "font-medium text-destructive"
                      }
                    >
                      {evt.impacts.return1w >= 0 ? "+" : ""}
                      {evt.impacts.return1w}%
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {evt.impacts ? (
                    <span
                      className={
                        evt.impacts.return1m >= 0
                          ? "font-medium text-primary"
                          : "font-medium text-destructive"
                      }
                    >
                      {evt.impacts.return1m >= 0 ? "+" : ""}
                      {evt.impacts.return1m}%
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {events.length} events
      </p>
    </div>
  );
}
