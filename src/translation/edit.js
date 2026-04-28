import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { LOCALES, getTabLabel } from './locales';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { locale, label } = attributes;

	const blockProps = useBlockProps( {
		className: 'bol-translation-editor',
	} );

	// Collect locales already claimed by sibling Translation blocks.
	const siblingLocales = useSelect(
		( select ) => {
			const { getBlockRootClientId, getBlock } =
				select( 'core/block-editor' );
			const parentId = getBlockRootClientId( clientId );
			if ( ! parentId ) {
				return [];
			}
			return ( getBlock( parentId )?.innerBlocks ?? [] )
				.filter(
					( b ) =>
						b.name === 'bol/translation' && b.clientId !== clientId
				)
				.map( ( b ) => b.attributes.locale );
		},
		[ clientId ]
	);

	const takenLocales = new Set( siblingLocales );

	// Keep the block's own current locale in the list so it stays selected;
	// exclude every locale a sibling already owns.
	const localeOptions = [
		{
			value: '',
			label: __( '— Select a language —', 'bol-easy-translations' ),
		},
		...LOCALES.filter(
			( l ) => l.value === locale || ! takenLocales.has( l.value )
		).map( ( l ) => ( {
			value: l.value,
			label: `${ l.flag } ${ l.label }`,
		} ) ),
	];

	function handleLocaleChange( value ) {
		setAttributes( {
			locale: value,
			label: value ? getTabLabel( value ) : '',
		} );
	}

	const displayLabel =
		label || locale || __( '(no locale set)', 'bol-easy-translations' );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Language Settings', 'bol-easy-translations' ) }
				>
					<SelectControl
						label={ __( 'Language', 'bol-easy-translations' ) }
						value={ locale }
						options={ localeOptions }
						onChange={ handleLocaleChange }
					/>
					<TextControl
						label={ __( 'Tab Label', 'bol-easy-translations' ) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						help={ __(
							'Overrides the switcher tab text. Defaults to the flag + language name when a language is selected above.',
							'bol-easy-translations'
						) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="bol-translation-editor__header">
					<span className="bol-translation-editor__label">
						{ displayLabel }
					</span>
					{ locale && (
						<code className="bol-translation-editor__locale">
							{ locale }
						</code>
					) }
				</div>
				<InnerBlocks template={ [ [ 'core/paragraph' ] ] } />
			</div>
		</>
	);
}
