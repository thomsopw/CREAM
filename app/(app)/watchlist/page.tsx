import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { WatchlistView } from "@/components/watchlist/watchlist-view";
import { getEventsWithImpacts, getCompanyByTicker } from "@/lib/data";

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const watchlistItems = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: "desc" },
  });

  const eventsWithImpacts = getEventsWithImpacts();
  const watchedTickers = watchlistItems.map((w) => w.ticker);
  const eventsForWatchlist = eventsWithImpacts.filter((e) =>
    watchedTickers.includes(e.ticker)
  );

  const watchlistWithCompanies = watchlistItems.map((w) => ({
    ...w,
    company: getCompanyByTicker(w.ticker),
    recentEvents: eventsForWatchlist
      .filter((e) => e.ticker === w.ticker)
      .slice(0, 3),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Watchlist</h1>
        <p className="mt-2 text-muted-foreground">
          Track stocks and monitor for major events
        </p>
      </div>

      <WatchlistView
        watchlist={watchlistWithCompanies}
        events={eventsForWatchlist}
      />

      <p className="text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
