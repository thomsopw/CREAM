export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: February 2025
      </p>

      <div className="mt-12 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Not Financial Advice
          </h2>
          <p>
            Cream provides research and data only. We do not provide financial
            advice, investment recommendations, or trading signals. You are
            solely responsible for your investment decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Use of Service
          </h2>
          <p>
            By using Cream, you agree to use the platform for lawful purposes
            only. You must not misuse the service, attempt to gain unauthorized
            access, or use the data in violation of any applicable laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p>
            For questions about these terms, contact us at legal@cream.example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
