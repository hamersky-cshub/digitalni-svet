// @ts-check
import { defineConfig } from 'astro/config';

// Web běží na https://hamersky-cshub.github.io/digitalni-svet/
// Při přechodu na vlastní doménu změňte `site` a `base` nastavte na '/'.
export default defineConfig({
  site: 'https://hamersky-cshub.github.io',
  base: '/digitalni-svet',
  trailingSlash: 'always',
});
