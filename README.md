# BOL Easy Translations

> Localized content blocks with a CSS/JS language switcher for WordPress.

[![Try in WordPress Playground](https://img.shields.io/badge/Try%20in-WordPress%20Playground-3858e9?logo=wordpress&logoColor=white)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/BigOrangeLab/bol-easy-translations/trunk/.github/blueprint.json)

**Author:** George Stephanis, [Big Orange Lab](https://bigorangelab.com/)  
**License:** GPL-2.0-or-later  
**Requires WordPress:** 6.8+  
**Requires PHP:** 7.4+

---

## Overview

BOL Easy Translations provides two Gutenberg blocks that let you author the same content in multiple languages inside a single post or page, then show visitors a tab-based switcher so they can read their preferred language.

| Block | Purpose |
|---|---|
| **Localized Content** (`bol/localized-content`) | Parent container; renders the front-end tab bar |
| **Translation** (`bol/translation`) | Inner block for one language; holds any standard blocks |

### Front-end behaviour

- A `<nav class="bol-language-switcher">` tab bar is injected above the translations via a lightweight view script (no jQuery, no framework).
- Language selection priority: `?lang=` URL parameter → `localStorage` → `navigator.languages` browser preference → first translation.
- The visitor's chosen locale is written to `localStorage` under `bol-preferred-locale` and to the `?lang=` query parameter via `history.replaceState`, so copied links open in the same language.
- Without JavaScript the first Translation block is shown and the rest are hidden via the HTML `hidden` attribute — no content is lost.
- The `lang` attribute is set on each translation wrapper, aiding screen readers and search-engine localisation signals.

---

## Block Usage

1. Insert a **Localized Content** block. It pre-fills with English and Español translation panels.
2. Click a Translation panel, then open the block inspector sidebar. Choose a language from the **Language** dropdown — the tab label (including emoji flag) is set automatically. Override it with the **Tab Label** field if needed.
3. Add your content (paragraphs, headings, images, etc.) inside each Translation panel.
4. To add a third (or fourth…) language, use the block appender inside the Localized Content block to insert another Translation block.
5. At least two Translation blocks must remain — the editor prevents reducing below two.

---

## Development

### Prerequisites

- Node.js 20+
- npm 10+
- PHP 7.4+ with Composer (for PHP linting)

### Setup

```bash
cd wp-content/plugins/bol-easy-translations
npm install
composer install
```

### Commands

| Command | Description |
|---|---|
| `npm run build` | Production build to `build/` |
| `npm start` | Watch mode (development build) |
| `npm run lint:js` | Lint JavaScript |
| `npm run lint:css` | Lint CSS/SCSS |
| `npm run format` | Auto-format source files |
| `npm run plugin-zip` | Create a distributable ZIP |
| `vendor/bin/phpcs` | PHP linting (WordPress + PHPCompatibility standards) |
| `vendor/bin/phpcbf` | Auto-fix PHP lint violations |

### Source layout

```
src/
├── localized-content/
│   ├── block.json      Block metadata
│   ├── index.js        Block registration
│   ├── edit.js         Editor component
│   ├── save.js         Static save (front-end markup)
│   ├── view.js         Front-end switcher script
│   ├── style.scss      Shared styles (editor + front end)
│   └── editor.scss     Editor-only styles
└── translation/
    ├── block.json
    ├── index.js
    ├── edit.js
    ├── save.js
    ├── locales.js      Locale list with emoji flags and BCP 47 codes
    ├── style.scss
    └── editor.scss
```

After editing source files, run `npm run build` (or keep `npm start` running) to recompile to `build/`.

---

## Styling the Switcher

The tab bar is intentionally low-specificity so your theme can override it easily:

```css
/* Target the switcher container */
.bol-language-switcher { }

/* Target individual tabs */
.bol-language-switcher__tab { }

/* Target the active tab */
.bol-language-switcher__tab.is-active { }
```

---

## Changelog

### 0.1.0
- Initial release.
