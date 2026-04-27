=== BOL Easy Translations ===
Contributors:      georgestephanis
Tags:              block, translation, localization, language, i18n, multilingual
Tested up to:      6.9
Stable tag:        0.1.0
Requires at least: 6.8
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
* Language preference is persisted in `localStorage` across page loads.
* The `lang` HTML attribute is set on each translation wrapper, which benefits screen readers and search engines.
* Supports wide and full alignment on the parent block.

== Installation ==

1. Upload the `bol-easy-translations` folder to `/wp-content/plugins/`.
2. Activate the plugin through the **Plugins** screen in WordPress.
3. In the block editor, search for **Localized Content** and insert it into your post or page.
4. The block pre-fills with English and Español translation panels. Edit the locale/label in the sidebar and add your content inside each panel.
5. Add more Translation blocks inside the Localized Content block for additional languages.

== Frequently Asked Questions ==

= Can I have more than two languages? =

Yes. Inside the Localized Content block you can insert as many Translation blocks as you need. Each one becomes a tab in the front-end switcher.

= Can I put any blocks inside a Translation block? =

Any block that is normally allowed in post content can be placed inside a Translation block — paragraphs, headings, images, galleries, columns, etc.

= What happens if a visitor has JavaScript disabled? =

The first Translation block is visible and the rest are hidden via the HTML `hidden` attribute (which browsers honour without JavaScript). Content is accessible; only the tab-switching behaviour requires JavaScript.

= How is the visitor's language preference remembered? =

The view script writes the chosen locale code to `localStorage` under the key `bol-preferred-locale`. On subsequent page loads any Localized Content block on the page will restore that locale if it is present among the available translations.

= Can I style the language switcher tabs? =

Yes. The switcher renders as a `<nav class="bol-language-switcher">` containing `<button class="bol-language-switcher__tab">` elements. The active tab also carries the `is-active` class. Override these in your theme stylesheet.

== Changelog ==

= 0.1.0 =
* Initial release.
