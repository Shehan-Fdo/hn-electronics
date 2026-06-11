"use client";

import { Button } from "@/components/ui/Button";

export default function ProductError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Product could not be loaded</h1>
      <p className="mt-3 text-muted">Please retry the product request.</p>
      <Button className="mt-8" onClick={reset}>Retry</Button>
    </section>
  );
}
