/**
 * Supported locales with emoji flags and native-language display names.
 *
 * Each entry: { value: BCP-47 code, flag: emoji, label: native name }
 * The switcher tab text is set to `flag + ' ' + label` when a locale is picked.
 */
export const LOCALES = [
	// English variants
	{ value: 'en',    flag: '🇺🇸', label: 'English' },
	{ value: 'en-GB', flag: '🇬🇧', label: 'English (UK)' },
	{ value: 'en-AU', flag: '🇦🇺', label: 'English (AU)' },
	{ value: 'en-CA', flag: '🇨🇦', label: 'English (CA)' },
	// Romance
	{ value: 'es',    flag: '🇪🇸', label: 'Español' },
	{ value: 'es-MX', flag: '🇲🇽', label: 'Español (MX)' },
	{ value: 'es-AR', flag: '🇦🇷', label: 'Español (AR)' },
	{ value: 'fr',    flag: '🇫🇷', label: 'Français' },
	{ value: 'fr-CA', flag: '🇨🇦', label: 'Français (CA)' },
	{ value: 'pt',    flag: '🇵🇹', label: 'Português' },
	{ value: 'pt-BR', flag: '🇧🇷', label: 'Português (BR)' },
	{ value: 'it',    flag: '🇮🇹', label: 'Italiano' },
	{ value: 'ro',    flag: '🇷🇴', label: 'Română' },
	{ value: 'ca',    flag: '🇦🇩', label: 'Català' },
	// Germanic
	{ value: 'de',    flag: '🇩🇪', label: 'Deutsch' },
	{ value: 'de-AT', flag: '🇦🇹', label: 'Deutsch (AT)' },
	{ value: 'de-CH', flag: '🇨🇭', label: 'Deutsch (CH)' },
	{ value: 'nl',    flag: '🇳🇱', label: 'Nederlands' },
	{ value: 'sv',    flag: '🇸🇪', label: 'Svenska' },
	{ value: 'da',    flag: '🇩🇰', label: 'Dansk' },
	{ value: 'nb',    flag: '🇳🇴', label: 'Norsk' },
	{ value: 'fi',    flag: '🇫🇮', label: 'Suomi' },
	// Slavic
	{ value: 'ru',    flag: '🇷🇺', label: 'Русский' },
	{ value: 'uk',    flag: '🇺🇦', label: 'Українська' },
	{ value: 'pl',    flag: '🇵🇱', label: 'Polski' },
	{ value: 'cs',    flag: '🇨🇿', label: 'Čeština' },
	{ value: 'sk',    flag: '🇸🇰', label: 'Slovenčina' },
	{ value: 'bg',    flag: '🇧🇬', label: 'Български' },
	{ value: 'hr',    flag: '🇭🇷', label: 'Hrvatski' },
	{ value: 'sr',    flag: '🇷🇸', label: 'Српски' },
	// Other European
	{ value: 'el',    flag: '🇬🇷', label: 'Ελληνικά' },
	{ value: 'hu',    flag: '🇭🇺', label: 'Magyar' },
	{ value: 'tr',    flag: '🇹🇷', label: 'Türkçe' },
	// Semitic / RTL
	{ value: 'ar',    flag: '🇸🇦', label: 'العربية' },
	{ value: 'he',    flag: '🇮🇱', label: 'עברית' },
	// South / Southeast Asian
	{ value: 'hi',    flag: '🇮🇳', label: 'हिन्दी' },
	{ value: 'bn',    flag: '🇧🇩', label: 'বাংলা' },
	{ value: 'id',    flag: '🇮🇩', label: 'Indonesia' },
	{ value: 'ms',    flag: '🇲🇾', label: 'Melayu' },
	{ value: 'th',    flag: '🇹🇭', label: 'ภาษาไทย' },
	{ value: 'vi',    flag: '🇻🇳', label: 'Tiếng Việt' },
	{ value: 'tl',    flag: '🇵🇭', label: 'Filipino' },
	// East Asian
	{ value: 'zh-CN', flag: '🇨🇳', label: '中文（简体）' },
	{ value: 'zh-TW', flag: '🇹🇼', label: '中文（繁體）' },
	{ value: 'ja',    flag: '🇯🇵', label: '日本語' },
	{ value: 'ko',    flag: '🇰🇷', label: '한국어' },
];

/** Returns `"🇺🇸 English"` for a given locale value, or the value itself if unknown. */
export function getTabLabel( value ) {
	const found = LOCALES.find( ( l ) => l.value === value );
	return found ? `${ found.flag } ${ found.label }` : value;
}

/** SelectControl-compatible options array. */
export const LOCALE_OPTIONS = [
	{ value: '', label: '— Select a language —' },
	...LOCALES.map( ( l ) => ( {
		value: l.value,
		label: `${ l.flag } ${ l.label }`,
	} ) ),
];
