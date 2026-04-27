import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { LOCALE_OPTIONS, getTabLabel } from './locales';

export default function Edit( { attributes, setAttributes } ) {
	const { locale, label } = attributes;

	const blockProps = useBlockProps( {
		className: 'bol-translation-editor',
	} );

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
						options={ LOCALE_OPTIONS }
						onChange={ handleLocaleChange }
					/>
					<TextControl
						label={ __( 'Tab Label', 'bol-easy-translations' ) }
						value={ label }
						onChange={ ( value ) => setAttributes( { label: value } ) }
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
