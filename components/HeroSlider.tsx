"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

interface HeroSliderProps {
  title: string;
  subtitle: string;
  textColor: string;
  images: string[];
}

export function HeroSlider({ title, subtitle, textColor, images }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds per slide
    
    return () => clearInterval(interval);
  }, [images]);

  const textClass = textColor === "black" ? "text-ink" : "text-white";
  const descClass = textColor === "black" ? "text-ink/80" : "text-white/80";
  const bgOp = textColor === "black" ? "bg-white/10 hover:bg-white/20 border-ink/20" : "bg-white/10 hover:bg-white/20 border-white/20";
  const btnText = textColor === "black" ? "text-ink hover:text-ink" : "text-white hover:text-white";

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Background Images */}
      {images && images.length > 0 ? (
        images.map((url, idx) => (
          <Image
            key={url}
            src={url}
            alt="Hero background"
            fill
            priority={idx === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? "opacity-50" : "opacity-0"}`}
          />
        ))
      ) : (
        <Image
          src="/hero-bg.png"
          alt="Circuit board background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
      )}

      {/* Content */}
      <div className={`relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 ${textClass}`}>
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-normal text-accent">HN Electronics Sri Lanka</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
            {title || 'Your Electronics Destination.'}
          </h1>
          <p className={`mt-6 max-w-2xl text-lg leading-8 ${descClass}`}>
            {subtitle || 'Discover reliable electronics, parts, accessories, and everyday tech essentials with a clean shopping experience.'}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/shop" size="lg" className="shadow-lg">
              Shop Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton href="/shop#categories" size="lg" className={`${bgOp} ${btnText} backdrop-blur-sm border`}>
              Browse Categories
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
