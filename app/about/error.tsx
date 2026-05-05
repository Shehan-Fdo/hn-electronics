"use client";

import { Button } from "@/components/ui/Button";

export default function AboutError({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Page could not be loaded</h1>
      <Button className="mt-8" onClick={reset}>Retry</Button>
    </section>
  );
}
