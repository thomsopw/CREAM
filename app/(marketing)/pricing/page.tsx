import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-bold">Pricing</h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Simple, transparent pricing. Start free and upgrade when you need more.
      </p>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <Card className="border-primary/30">
          <CardHeader>
            <h3 className="text-xl font-semibold">Free</h3>
            <p className="text-3xl font-bold">
              $0<span className="text-lg font-normal text-muted-foreground">/month</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Access to all scenarios</li>
              <li>✓ Browse events feed</li>
              <li>✓ Company profiles</li>
              <li>✓ 1 alert per week via email</li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">Pro</h3>
              <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                Coming Soon
              </span>
            </div>
            <p className="text-3xl font-bold">
              $25<span className="text-lg font-normal text-muted-foreground">/month</span>
            </p>
            <p className="text-sm text-muted-foreground">
              with annual plan
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Everything in Free</li>
              <li>✓ Unlimited alerts</li>
              <li>✓ Watchlists</li>
              <li>✓ Extended historical data</li>
              <li>✓ Priority support</li>
            </ul>
            <Button className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-center text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
