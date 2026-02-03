import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AlertsView } from "@/components/alerts/alerts-view";
import { scenarios } from "@/lib/data";

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const userAlerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="mt-2 text-muted-foreground">
          Get notified when events match your criteria. Email delivery coming
          soon.
        </p>
      </div>

      <AlertsView alerts={userAlerts} scenarios={scenarios} />

      <p className="text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
