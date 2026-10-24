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
- The existing documents retain their original languages. The presentation is labeled as Chinese in the English homepage.

## Files

- `index.html`: original design template plus time, sky, and interaction logic.
- `assets/dayx/language.js`: Chinese/English copy and language detection.
- `assets/dayx/enhancements.css`: responsive navigation, product previews, reduced-motion handling, and layout refinements.
- `assets/dayx/*-preview.png`: screenshots of the two live websites, captured 2026-10-25 (Singapore).
- `assets/dayx/*.woff2`: fonts embedded in the supplied design; license notices are retained in `FONT-LICENSES.txt`.
- `assets/dayx/runtime.js`, `react*.js`: locally bundled rendering dependencies from the supplied design. The homepage requires no CDN requests.

Four projects are featured: PostDiff, AI Video Costs, Screen TimeLapseZ, and InvestmentGenieTracker. Existing app screenshots, App Store destinations, reviews, privacy URLs, archives, feed, favicon, and CNAME are preserved. No project source-code links or social handles have been invented.

Without JavaScript, a bilingual fallback provides project descriptions, destination links, contact information, and privacy documents.

The hero clock uses the visitor’s local time and timezone. The sky and section colors are artistic time-of-day visualizations, not location-based astronomical measurements. The 07:00–24:00 section schedule is the design’s narrative, not product release dates.
