# Full Audit Report

- URL: `http://localhost:3000`
- Generated: `2026-07-12T19:31:02.894409`
- Overall score: `66/100`
- Score confidence: `Medium`
- Scoring version: `1`

## Score Card

| Category | Weight | Score |
| --- | ---: | ---: |
| Security Headers | 8 | 75 |
| Social Meta | 5 | 85 |
| Robots and Crawlers | 8 | 100 |
| Broken Links | 10 | 100 |
| Internal Links | 8 | 60 |
| Redirects | 3 | 100 |
| AI Search | 5 | 85 |
| Performance and Core Web Vitals | 13 | 0 |
| On-Page SEO | 10 | 100 |
| Readability | 8 | 3 |
| Entity SEO | 5 | 60 |
| Link Profile | 7 | 5 |
| Hreflang | 5 | 0 |
| Content Uniqueness | 5 | 0 |

## Findings

| Severity | Area | Finding | Evidence | Fix |
| --- | --- | --- | --- | --- |
| Critical | link_profile | 19 orphan page(s) with zero inbound internal links. |  | Add internal links from relevant content pages to these orphan pages. |
| Critical | link_profile | Average internal links per page is only 1.9 (target: 5-10). |  | Increase internal linking by adding contextual links within content. |
| Critical | security | 🔴 Site not using HTTPS — critical for SEO and trust |  |  |
| Warning | broken_links | ⚠️ 1 redirect chain(s) detected (>1 hop) |  |  |
| Warning | entity | sameAs URL returns HTTP 404: https://x.com/hnelectronics |  | Update sameAs URL for Twitter/X to a valid, non-redirecting destination. |
| Warning | entity | sameAs URL returns HTTP 404: https://www.linkedin.com/company/hnelectronics |  | Update sameAs URL for LinkedIn to a valid, non-redirecting destination. |
| Warning | environment | Meta description is missing or out of range | This can reduce SERP CTR and snippet quality. | Use the Next.js Metadata API (`app/`) or `next/head` (`pages/`) for title/meta/OG/Twitter tags. |
| Warning | environment | Title tag needs optimization | Title length/content is likely suboptimal for rankings and click-through. | Use the Next.js Metadata API (`app/`) or `next/head` (`pages/`) for title/meta/OG/Twitter tags. |
| Warning | environment | Content readability is difficult | Long, complex text can reduce engagement and comprehension. | Rewrite key sections with shorter sentences (15-20 words), shorter paragraphs (2-4 sentences), and clearer subheadings. |
| Warning | internal_links | ⚠️ 13 potential orphan page(s) (≤1 internal link pointing to them) |  |  |
| Warning | internal_links | ⚠️ 45 link(s) have no anchor text |  |  |
| Warning | link_profile | 19 page(s) with no outbound internal links (dead ends). |  | Add contextual internal links to related content from these pages. |
| Warning | readability | ⚠️ Content is difficult to read (Flesch: 2.3) — may reduce engagement |  |  |
| Warning | readability | ⚠️ 35.7% complex words (3+ syllables) — consider simplifying |  |  |
| Warning | readability | ⚠️ Thin content (28 words) — may rank poorly |  |  |
| Info | Wikidata | No Wikidata entry found for 'HN Electronics'. |  | If the entity meets Wikidata notability guidelines, create or improve an item with accurate third-party references. Do not create one solely for SEO. |
| Info | Wikipedia | No Wikipedia article found for 'HN Electronics'. |  | Only pursue Wikipedia if the entity meets independent notability standards. Otherwise, strengthen official schema, sameAs profiles, citations, and About/Contact signals. |
| Info | environment | Performance measurement incomplete | PageSpeed API returned an error, so CWV recommendations are less reliable. | Set `PAGESPEED_API_KEY` in your environment or `.env` file (see `.env.example`), then rerun. The CLI also accepts `--api-key`. Prioritize LCP/INP/CLS fixes from that output. |
| info | pagespeed | pagespeed measurement incomplete | Rate limited by Google API. Wait a few minutes or add an API key. | Rerun this check after resolving the environment/API/network limitation. |

## Measurement Notes

1 checks returned errors or incomplete measurements; treat affected scores as directional.
