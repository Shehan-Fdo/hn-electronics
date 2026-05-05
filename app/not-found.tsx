import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-4 text-4xl font-bold">Page not found</h1>
      <p className="mt-4 text-muted">The page you are looking for is not available.</p>
      <div className="mt-8 flex justify-center gap-3">
        <LinkButton href="/">Home</LinkButton>
        <LinkButton href="/shop" variant="secondary">Shop</LinkButton>
      </div>
    </section>
  );
}
