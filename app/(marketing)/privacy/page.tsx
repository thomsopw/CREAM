export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: February 2025
      </p>

      <div className="mt-12 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Information We Collect
          </h2>
          <p>
            We collect information you provide when signing up, including email
            address and account preferences. We use this to provide the service
            and communicate with you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            How We Use Your Information
          </h2>
          <p>
            Your information is used to operate the platform, send alerts you
            configure, and improve our services. We do not sell your personal
            data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p>
            For privacy-related questions, contact us at privacy@cream.example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
