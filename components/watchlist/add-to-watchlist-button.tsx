"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AddToWatchlistButton({ ticker }: { ticker: string }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  async function handleAdd() {
    setLoading(true);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      if (res.ok) {
        setAdded(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (added) {
    return (
      <Button variant="outline" disabled>
        Added to Watchlist
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleAdd} disabled={loading}>
      {loading ? "Adding..." : "Add to Watchlist"}
    </Button>
  );
}
