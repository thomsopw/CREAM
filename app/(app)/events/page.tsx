import { EventsTable } from "@/components/events/events-table";
import { getEventsWithImpacts } from "@/lib/data";

export default function EventsPage() {
  const eventsWithImpacts = getEventsWithImpacts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Events Feed</h1>
        <p className="mt-2 text-muted-foreground">
          Real-time feed of detected events across companies. Filter by event
          type, ticker, or date.
        </p>
      </div>

      <EventsTable events={eventsWithImpacts} />

      <p className="text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
