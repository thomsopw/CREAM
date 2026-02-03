import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">About Cream</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The knowledge gap between institutional investors and retail investors
        widens each year. We&apos;re building a research automation platform for
        self-directed investors to level the playing field.
      </p>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We built AI and language processing technology to identify
              market-moving events. This technology helps investors find
              opportunities in patterns that move stock prices.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Inspiration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Institutional investors profit from event-driven strategies. We
              expose that playbook so any investor can identify the same
              patterns.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tools that are simple, transparent, and professional-grade.
              Accessible and affordable for every investor.
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
