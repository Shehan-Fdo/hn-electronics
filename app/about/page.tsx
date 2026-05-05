import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { MotionSection, MotionStaggerDiv, MotionArticle } from "@/components/Motion";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about HN Electronics and contact the Sri Lankan electronics store."
};

export default function AboutPage() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94786637512";

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <MotionSection className="max-w-3xl">
        <p className="text-sm uppercase tracking-normal text-accent">About HN Electronics</p>
        <h1 className="mt-4 text-5xl font-bold leading-tight">Practical electronics, presented clearly.</h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          HN Electronics is a Sri Lankan electronics store focused on reliable components, accessories, and everyday tech.
          The storefront is built to make browsing simple, fast, and easy to confirm through WhatsApp.
        </p>
      </MotionSection>

      <MotionStaggerDiv className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          ["Mission", "Help customers find genuine electronics without clutter or complicated checkout flows."],
          ["Products", "Electronics, components, repair accessories, development boards, cables, and related essentials."],
          ["Service", "Availability and delivery details are confirmed directly before each order is finalized."]
        ].map(([title, text]) => (
          <MotionArticle key={title} className="rounded border border-line p-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
          </MotionArticle>
        ))}
      </MotionStaggerDiv>

      <MotionSection id="contact" className="mt-20 border-t border-line pt-12">
        <p className="text-sm uppercase tracking-normal text-muted">Contact</p>
        <h2 className="mt-2 text-3xl font-bold">Talk to HN Electronics</h2>
        <MotionStaggerDiv className="mt-8 grid gap-4 md:grid-cols-2">
          <MotionArticle className="rounded border border-line p-5">
            <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
            <h3 className="mt-4 font-semibold">Phone</h3>
            <p className="mt-1 text-muted">+94 78 663 7512</p>
          </MotionArticle>
          <MotionArticle className="rounded border border-line p-5">
            <Mail className="h-5 w-5 text-accent" aria-hidden="true" />
            <h3 className="mt-4 font-semibold">Email</h3>
            <p className="mt-1 text-muted">hello@hnelectronics.lk</p>
          </MotionArticle>
          <MotionArticle className="rounded border border-line p-5">
            <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
            <h3 className="mt-4 font-semibold">Location</h3>
            <p className="mt-1 text-muted">Sri Lanka</p>
          </MotionArticle>
          <MotionArticle className="rounded border border-line p-5">
            <MessageCircle className="h-5 w-5 text-accent" aria-hidden="true" />
            <h3 className="mt-4 font-semibold">WhatsApp</h3>
            <LinkButton className="mt-4" href={`https://wa.me/${number}`} variant="secondary">
              Message on WhatsApp
            </LinkButton>
          </MotionArticle>
        </MotionStaggerDiv>
      </MotionSection>
    </div>
  );
}
