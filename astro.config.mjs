import { defineConfig } from 'astro/config';
import lighthouse from './src/lighthouse.js';

// https://astro.build/config
export default defineConfig({
  integrations: [
    lighthouse()
  ]
});

