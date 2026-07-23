"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";

type Suggestion = {
  slug: string;
  name: string;
  price: string;
  image: string | null;
  alt: string;
};

export function SearchBar({
  defaultValue = "",
  compact = false,
  liveSearch = false,
  className
}: {
  defaultValue?: string;
  compact?: boolean;
  liveSearch?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live search URL update (for Shop page)
  useEffect(() => {
    if (!liveSearch) return;

    const timer = setTimeout(() => {
      const trimmed = query.trim();
      const currentSearch = searchParams.get("search") || "";

      if (trimmed !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (trimmed) {
          params.set("search", trimmed);
        } else {
          params.delete("search");
        }
        params.delete("page");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, liveSearch, searchParams, pathname, router]);

  // Suggestions fetching (for Navbar search)
  useEffect(() => {
    if (liveSearch) return;

    const trimmedQuery = query.trim();
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setSuggestions([]);
      setSearchError(false);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setSearchError(false);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setIsOpen(true);
        } else {
          setSuggestions([]);
          setSearchError(true);
          setIsOpen(true);
        }
      } catch {
        setSuggestions([]);
        setSearchError(true);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, liveSearch]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsOpen(false);
    const trimmed = query.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("search", trimmed);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div ref={wrapperRef} className={cn("relative flex w-full", className)}>
      <form
        onSubmit={onSubmit}
        className="flex w-full items-center rounded border border-line bg-white"
        role="search"
      >
        <Search className="ml-3 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          aria-label="Search products"
          className={cn(
            "min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted",
            compact ? "h-10" : "h-11"
          )}
          placeholder="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (!liveSearch && (suggestions.length > 0 || searchError)) setIsOpen(true);
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mr-2 text-muted hover:text-ink"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading ? (
          <Loader2 className="mr-3 h-4 w-4 animate-spin text-muted" />
        ) : (
          <Button className="m-1 shrink-0" size="sm" type="submit" aria-label="Submit product search">
            Search
          </Button>
        )}
      </form>

      {isOpen && (suggestions.length > 0 || searchError) && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded border border-line bg-white shadow-lg">
          {searchError ? (
            <p className="px-4 py-3 text-sm text-muted">Search unavailable. Try again.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion.slug}>
                  <Link
                    href={`/products/${suggestion.slug}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-line bg-neutral-50">
                      {suggestion.image ? (
                        <Image
                          src={suggestion.image}
                          alt={suggestion.alt}
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-[10px] text-muted">No img</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{suggestion.name}</p>
                      <p className="text-xs text-muted">{formatPrice(suggestion.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
