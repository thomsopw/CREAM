import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">How Cream Works</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Our AI analyzes events from documents, news, and financial filings to
        find events that move stocks. Here&apos;s how you can use it.
      </p>

      <div className="mt-16 space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>1. Select events proven to move stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Choose from dozens of positive and negative event catalysts — such
              as activist investments, CEO changes, or regulatory actions. Monitor
              the market and spot opportunities when scenarios arise.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. View price reaction patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Find stocks that return value even in bear markets. Customize your
              strategy by industry and financial performance. Win rates, average
              returns, and historical patterns at a glance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Get AI stock alerts for event catalysts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Day trading alerts. Swing trading AI alerts. Long-term,
              event-driven catalysts. Set your preferences and let the AI deliver
              opportunities to your inbox.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Monitor your stocks for major events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Add companies to your watchlists to track their performance and
              plan for possible events. Get notified when material events occur.
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
