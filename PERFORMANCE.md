# Scroll performance verification

The regression workload scrolls the top of the homepage in 80 steps, 50 ms apart, after the initial animation has settled. These are isolated headless Chromium runs on the same machine; timing varies with GPU and host load. The stable regression budgets check rendering, geometry reads, and sky draw counts rather than promising a frame rate on every device.

| Metric | Before | After |
| --- | ---: | ---: |
| Full-page render calls | 123 | 6 |
| Section-position rectangle reads | 474 | 0 |
| Sky draw calls | 241 | 112 |
| Script time | 575.7 ms | 52.4 ms |
| Layout time | 12.2 ms | 5.2 ms |
| Style recalculation time | 52.9 ms | 354.0 ms |
| Total task time | 4697.7 ms | 3094.3 ms |

Some work moves from JavaScript rendering to scoped CSS variable updates; style recalculation increases in this sample, while total task time falls. Offscreen sections skip repeated palette updates. ResizeObserver invalidates cached positions when content size changes.

Moving flap characters update their own text leaves. Periodic clock/content updates still use the existing runtime. The ambient sky draws at most 30 times per second, stops offscreen, and renders on changes in reduced-motion mode. Its WebGL drawing buffer no longer requires preservation or per-frame layout reads.

Run `tests/scroll-performance.cjs` with Playwright installed and the site served locally to enforce render, layout-read, and drawing budgets. Functional browser checks also cover shuffle settling, scroll-driven color and navigation time, viewport resizing, bilingual controls, and long email wrapping.
