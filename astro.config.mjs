import { defineConfig } from 'astro/config';

// სტატიკური build (Vercel / Netlify). Tailwind მუშაობს PostCSS-ით (postcss.config.cjs).
// დომენი იწერება src/config/site.ts-ში (domain) — OG ბმულები იქიდან აწყობა.
export default defineConfig({
  output: 'static',
  build: { inlineStylesheets: 'always' },
});
