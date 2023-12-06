# astro-lighthouse

An astro integration that adds Pagespeed insights into the dev toolbar.

## Installation

Just run `astro add astro-lighthouse` and you're good to go!

Alternatively, you can install it manually:

1. Install the package with `npm install astro-lighthouse`
2. Add the following to your `astro.config.mjs`:

```js
import lighthouse from 'astro-lighthouse';

export default {
  integrations: [
    lighthouse(),
    // Your other integrations here
  ],
};
```