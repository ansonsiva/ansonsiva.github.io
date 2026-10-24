# dayxlab

Jun Zheng’s personal homepage, built from the supplied “一天的实验室” interactive design. Hosted as a static GitHub Pages site at **www.dayxlab.com**.

## Preview

No install or build step is required. From this directory:

```sh
python3 -m http.server 8765
```

Open http://localhost:8765. Serve the site from the root; assets and existing document links use root-relative URLs.

## Languages

- First visit: the browser’s primary preferred language selects Chinese for `zh`, `zh-CN`, `zh-TW`, and other Chinese variants; all other languages select English.
- The header button switches the complete homepage immediately, including greetings, clock controls, project descriptions, documents, city names, and accessibility labels.
- Manual preference is saved as `dayx-language` in localStorage. When storage is unavailable, switching still works for the current page.
- Both privacy pages use the homepage’s visual language, local-time colors, live clock, and language preference. English policy text is preserved except for the requested contact-email update, alongside a Chinese reading translation.

## Files

- `index.html`: original design template plus time, sky, and interaction logic.
- `assets/dayx/language.js`: Chinese/English copy and language detection.
- `assets/dayx/documents.css`, `documents.js`, `document-theme.js`: shared privacy-page layout, bilingual reading content, and matching local-time colors.
- `assets/dayx/enhancements.css`: responsive navigation, product previews, reduced-motion handling, and layout refinements.
- `assets/dayx/*-preview.png`: screenshots of the two live websites, captured 2026-10-25 (Singapore).
- `assets/dayx/*.woff2`: fonts embedded in the supplied design; license notices are retained in `FONT-LICENSES.txt`.
- `assets/dayx/runtime.js`, `react*.js`: locally bundled rendering dependencies from the supplied design. The homepage requires no CDN requests.

Four projects are featured: PostDiff, AI Video Costs, Screen TimeLapseZ, and InvestmentGenieTracker. Existing app screenshots, App Store destinations, reviews, privacy URLs, archives, favicon, and CNAME are preserved. Visible RSS entries have been removed; the existing feed URL remains available to older subscribers. The X profile links to @jasonamFzb24. The presentation and its homepage entry have been removed.

Without JavaScript, a bilingual fallback provides project descriptions, destination links, contact information, and privacy documents.

The hero clock uses the visitor’s local time and timezone. The sky and section colors are artistic time-of-day visualizations, not location-based astronomical measurements. The 07:00–24:00 section schedule is the design’s narrative, not product release dates.

## Scroll performance

Scroll positions are cached and refreshed on resize or content-size changes. Scroll-driven colors and the navigation clock update directly, while only visible sections receive theme writes. Moving split-flap characters update their own text leaves, so they do not render the full page. Ambient WebGL sky drawing is limited to 30 frames per second and paused while offscreen; reduced-motion mode renders it only when the time/theme changes. Clock controls and bilingual content remain managed by the original rendering runtime.

Contact: [ansonsiva@mail.grokbot.com](mailto:ansonsiva@mail.grokbot.com).

An optional browser regression check is available at `tests/scroll-performance.cjs`. With Playwright installed and the local server running, use `node tests/scroll-performance.cjs`. It checks scroll render/layout budgets in a real browser. `DAYX_TEST_URL` selects another root preview URL; `DAYX_PLAYWRIGHT_MODULE` can point to an existing Playwright package. No testing dependency is needed to serve the site.
