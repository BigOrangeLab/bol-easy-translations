const STORAGE_KEY = 'bol-preferred-locale';
const URL_PARAM = 'lang';

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

function getLangFromUrl() {
	return new URLSearchParams( window.location.search ).get( URL_PARAM );
}

function setLangInUrl( locale ) {
	const params = new URLSearchParams( window.location.search );
	params.set( URL_PARAM, locale );
	// replaceState keeps one history entry — back button leaves the page, not
	// the language. Hash is preserved so on-page anchor links still work.
	window.history.replaceState(
		null,
		'',
		`${ window.location.pathname }?${ params }${ window.location.hash }`
	);
}

// ---------------------------------------------------------------------------
// Locale matching
// ---------------------------------------------------------------------------

/**
 * Returns the index in `locales` that best matches `preferred`, or -1.
 * Tries exact match first, then base-language match (e.g. "es-MX" → "es").
 * @param {string[]} locales   Array of locale codes from data-locale attributes.
 * @param {string}   preferred Locale code to match against.
 */
function matchLocale( locales, preferred ) {
	const norm = preferred.toLowerCase();
	const exact = locales.findIndex( ( l ) => l.toLowerCase() === norm );
	if ( exact !== -1 ) {
		return exact;
	}

	const base = norm.split( '-' )[ 0 ];
	return locales.findIndex(
		( l ) => l.split( '-' )[ 0 ].toLowerCase() === base
	);
}

/**
 * Determines which translation index to show on load.
 *
 * Priority:
 *  1. ?lang= URL parameter  (explicit link — highest trust)
 *  2. localStorage          (user's previous explicit choice)
 *  3. navigator.languages   (browser preference — silent, no URL update)
 *  4. 0                     (first translation — final fallback)
 *
 * Returns { index, fromUrl } so callers know whether to write the URL.
 * @param {HTMLElement[]} translations Array of .wp-block-bol-translation elements.
 */
function resolveInitialIndex( translations ) {
	const locales = translations.map( ( t ) => t.dataset.locale || '' );

	const urlLang = getLangFromUrl();
	if ( urlLang ) {
		const idx = matchLocale( locales, urlLang );
		if ( idx !== -1 ) {
			return { index: idx, fromUrl: true };
		}
	}

	const stored = localStorage.getItem( STORAGE_KEY );
	if ( stored ) {
		const idx = matchLocale( locales, stored );
		if ( idx !== -1 ) {
			return { index: idx, fromUrl: false };
		}
	}

	const navLangs = [
		...( navigator.languages || [] ),
		...( navigator.language ? [ navigator.language ] : [] ),
	];
	// Deduplicate while preserving order.
	const seen = new Set();
	for ( const lang of navLangs ) {
		if ( seen.has( lang ) ) {
			continue;
		}
		seen.add( lang );
		const idx = matchLocale( locales, lang );
		if ( idx !== -1 ) {
			return { index: idx, fromUrl: false };
		}
	}

	return { index: 0, fromUrl: false };
}

// ---------------------------------------------------------------------------
// Switcher init
// ---------------------------------------------------------------------------

function initSwitchers() {
	document
		.querySelectorAll( '.wp-block-bol-localized-content' )
		.forEach( ( container ) => initSwitcher( container ) );
}

function initSwitcher( container ) {
	const translations = Array.from(
		container.querySelectorAll( ':scope > .wp-block-bol-translation' )
	);

	if ( translations.length < 2 ) {
		translations.forEach( ( t ) => ( t.hidden = false ) );
		return;
	}

	const { index: initialIndex, fromUrl } =
		resolveInitialIndex( translations );

	// If the initial choice came from navigator.languages (not URL or storage),
	// write the URL so a copied link opens the same language.
	// Skip if it's just the default fallback (index 0 with no signal).
	const shouldWriteUrl = ! fromUrl;

	const switcher = buildSwitcher( translations, initialIndex, ( index ) => {
		const locale = translations[ index ].dataset.locale;
		activate( translations, switcher.buttons, index );
		localStorage.setItem( STORAGE_KEY, locale );
		setLangInUrl( locale );
	} );

	container.insertBefore( switcher.el, container.firstChild );
	activate( translations, switcher.buttons, initialIndex );

	// Write URL only for an explicit signal (stored or navigator), not for
	// the bare default so we don't pollute clean URLs unnecessarily.
	const initialLocale = translations[ initialIndex ].dataset.locale;
	if ( shouldWriteUrl && initialLocale && initialIndex !== 0 ) {
		setLangInUrl( initialLocale );
	} else if ( fromUrl ) {
		// URL already has the param; normalise it in case the case differs.
		setLangInUrl( initialLocale );
	}
}

function buildSwitcher( translations, activeIndex, onSelect ) {
	const nav = document.createElement( 'nav' );
	nav.className = 'bol-language-switcher';
	nav.setAttribute( 'aria-label', 'Language switcher' );

	const buttons = translations.map( ( translation, index ) => {
		const label = translation.dataset.label || translation.dataset.locale;
		const locale = translation.dataset.locale;

		const btn = document.createElement( 'button' );
		btn.type = 'button';
		btn.className = 'bol-language-switcher__tab';
		btn.textContent = label;
		btn.setAttribute( 'lang', locale );
		btn.setAttribute( 'role', 'tab' );
		btn.setAttribute(
			'aria-selected',
			index === activeIndex ? 'true' : 'false'
		);

		btn.addEventListener( 'click', () => onSelect( index ) );

		nav.appendChild( btn );
		return btn;
	} );

	return { el: nav, buttons };
}

function activate( translations, buttons, index ) {
	translations.forEach( ( t, i ) => {
		t.hidden = i !== index;
		t.setAttribute( 'aria-hidden', i !== index ? 'true' : 'false' );
	} );
	buttons.forEach( ( btn, i ) => {
		btn.classList.toggle( 'is-active', i === index );
		btn.setAttribute( 'aria-selected', i === index ? 'true' : 'false' );
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initSwitchers );
} else {
	initSwitchers();
}
