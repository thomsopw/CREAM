"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Scenario = {
  id: string;
  name: string;
};

type Alert = {
  id: string;
  eventTypes: string;
  minReturn: number | null;
  industries: string | null;
  isActive: boolean;
};

export function AlertsView({
  alerts,
  scenarios,
}: {
  alerts: Alert[];
  scenarios: Scenario[];
}) {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [minReturn, setMinReturn] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleScenario(id: string) {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTypes: selectedScenarios,
          minReturn: minReturn ? parseFloat(minReturn) : null,
        }),
      });
      if (res.ok) {
        setSelectedScenarios([]);
        setMinReturn("");
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch("/api/alerts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      window.location.reload();
    } catch {}
  }

  async function handleToggle(id: string, isActive: boolean) {
    try {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      window.location.reload();
    } catch {}
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Create new alert</h3>
          <p className="text-sm text-muted-foreground">
            Select event types and optional filters. We&apos;ll notify you when
            matching events are detected.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <Label>Event types</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleScenario(s.id)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      selectedScenarios.includes(s.id)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="max-w-xs">
              <Label htmlFor="minReturn">Minimum expected return (%)</Label>
              <Input
                id="minReturn"
                type="number"
                step="0.1"
                placeholder="e.g. 10"
                value={minReturn}
                onChange={(e) => setMinReturn(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || selectedScenarios.length === 0}
            >
              Create alert
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-4 font-semibold">Your alerts</h3>
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No alerts yet. Create one above.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const types = JSON.parse(alert.eventTypes || "[]") as string[];
              const scenarioNames = types
                .map((id) => scenarios.find((s) => s.id === id)?.name)
                .filter(Boolean);
              return (
                <Card key={alert.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">
                        {scenarioNames.join(", ") || "Event types"}
                      </p>
                      {alert.minReturn != null && (
                        <p className="text-sm text-muted-foreground">
                          Min return: {alert.minReturn}%
                        </p>
                      )}
                      <span
                        className={`mt-1 inline-block text-xs ${
                          alert.isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {alert.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToggle(alert.id, alert.isActive)
                        }
                      >
                        {alert.isActive ? "Pause" : "Resume"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(alert.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
