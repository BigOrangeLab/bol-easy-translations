=== BOL Easy Translations ===
Contributors:      georgestephanis
Tags:              block, translation, localization, language, i18n, multilingual
Tested up to:      nightly
Stable tag:        1.0.0
Requires at least: 7.0
Requires PHP:      7.4
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Create localized content areas for multiple translations and display them with a CSS/JS language switcher.

== Description ==

BOL Easy Translations provides two blocks that let you author content in multiple languages inside a single post or page, and automatically surface a tab-based language switcher to visitors on the front end.

**Localized Content block** — a parent container that holds one or more Translation blocks. On the front end it renders a tab bar above the content; visitors click a tab to switch languages, and their preference is remembered via `localStorage`.

**Translation block** — an inner block representing one language variant. Each Translation block carries a language label (e.g. *Español*) and a locale code (e.g. `es`) and can contain any standard WordPress blocks: paragraphs, headings, images, lists, and so on.

Key features:

* Works entirely with static block markup — no server-side rendering required.
* Falls back gracefully without JavaScript: the first translation is shown; the rest are hidden via the `hidden` HTML attribute.
* Browser language auto-detected on first visit via `navigator.languages`.
* Language preference persisted in `localStorage` and in the `?lang=` URL parameter — copied links open in the same language.
* At least two Translation blocks are always enforced; the editor prevents removing the last two.
* The `lang` HTML attribute is set on each translation wrapper, which benefits screen readers and search engines.
* Supports wide and full alignment on the parent block.
* **AI-powered auto-translation** via the WordPress 7.0 core AI Client — configure any connector in Settings > Connectors (OpenAI, Gemini, a local Ollama or LM Studio instance, etc.) and generate a full translated version of any language panel with one click. Large posts are automatically split into smaller chunks to stay within model token limits.

== Installation ==

1. Upload the `bol-easy-translations` folder to `/wp-content/plugins/`.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. In the block editor, search for **Localized Content** and insert it into your post or page.
4. The block pre-fills with English and Español translation panels. Open the block inspector sidebar to choose a language from the dropdown — the tab label and emoji flag are set automatically. Add your content inside each panel.
5. Add more Translation blocks inside the Localized Content block for additional languages.

== Frequently Asked Questions ==

= Can I have more than two languages? =

Yes. Inside the Localized Content block you can insert as many Translation blocks as you need. Each one becomes a tab in the front-end switcher.

= Can I put any blocks inside a Translation block? =

Any block that is normally allowed in post content can be placed inside a Translation block — paragraphs, headings, images, galleries, columns, etc.

= What happens if a visitor has JavaScript disabled? =

The first Translation block is visible and the rest are hidden via the HTML `hidden` attribute (which browsers honour without JavaScript). Content is accessible; only the tab-switching behaviour requires JavaScript.

= Does the plugin auto-detect my visitor's language? =

Yes. On first visit the view script reads `navigator.languages` (the browser's ordered language preference list) and selects the best matching translation automatically.

= How is the visitor's language preference remembered? =

The view script writes the chosen locale code to `localStorage` under the key `bol-preferred-locale` and to the `?lang=` URL query parameter via `history.replaceState`. Both persist across page loads; the URL parameter means a copied or shared link will open in the same language on any browser.

= Can I style the language switcher tabs? =

Yes. The switcher renders as a `<nav class="bol-language-switcher">` containing `<button class="bol-language-switcher__tab">` elements. The active tab also carries the `is-active` class. Override these in your theme stylesheet.

= How does AI auto-translation work? =

The plugin uses the **WordPress 7.0 core AI Client** (`WordPress\AiClient\AiClient`). Any connector configured in **Settings > Connectors** is used automatically — no third-party AI plugin is required. Click the translate icon in the Localized Content block toolbar, choose a source and target language, and click Generate Translation. All inline HTML formatting is preserved; only visible text is translated.

= Does AI translation handle long posts? =

Yes. Content is automatically split into chunks (by block, up to 25 items or 8 000 HTML characters per request) and each chunk is sent as a separate AI call. Results are merged back before the new Translation block is inserted, so the process is transparent regardless of post length.

= Do I need a specific AI model? =

Any text-generation model reachable through a configured connector works. The plugin automatically suppresses extended chain-of-thought reasoning on thinking models (such as Qwen3 or DeepSeek-R1) to keep response times fast.

== Changelog ==

= 1.0.0 =
* AI-powered auto-translation via the WordPress 7.0 core AI Client — configure any connector in Settings > Connectors and generate a full translated language panel in one click.
* Translation requests are automatically chunked by block (≤ 25 items / ≤ 8 000 HTML characters per request) so long posts never hit model token limits.
* Extended chain-of-thought reasoning is suppressed for thinking models (Qwen3, DeepSeek-R1, etc.) to prevent request timeouts.
* Language selector in the Translation block now excludes locales already claimed by sibling translations.
* Inline HTML formatting (bold, links, code, etc.) is preserved through translation.

= 0.1.0 =
* Initial release.
