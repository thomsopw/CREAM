import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>

      <Accordion type="single" collapsible className="mt-12">
        <AccordionItem value="what">
          <AccordionTrigger>What is Cream?</AccordionTrigger>
          <AccordionContent>
            Cream is an AI-powered event-driven stock research platform. We scan
            millions of events from news, SEC filings, and other sources to find
            events that historically move stock prices. You can explore scenarios,
            set alerts, and build watchlists to discover opportunities.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="events">
          <AccordionTrigger>What types of events do you track?</AccordionTrigger>
          <AccordionContent>
            We track 15+ event types including return of capital (dividends,
            buybacks), government actions (FDA approvals), restructuring,
            activist investors, CEO changes, contract awards, short seller
            reports, index inclusion/exclusion, and more.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="advice">
          <AccordionTrigger>Is this financial advice?</AccordionTrigger>
          <AccordionContent>
            No. Cream provides research and data only. We do not recommend
            specific trades or investments. Past performance does not guarantee
            future results. Always do your own research and consider consulting
            a financial advisor.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="alerts">
          <AccordionTrigger>How do alerts work?</AccordionTrigger>
          <AccordionContent>
            You create alerts by selecting event types and optional filters (e.g.,
            minimum expected return). When we detect events that match your
            criteria, we&apos;ll notify you. Email delivery is coming soon.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <p className="mt-12 text-xs text-muted-foreground">
        This is not financial advice. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
