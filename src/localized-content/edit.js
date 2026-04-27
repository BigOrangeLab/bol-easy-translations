import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [ 'bol/translation' ];

const TEMPLATE = [
	[ 'bol/translation', { locale: 'en', label: '🇺🇸 English' } ],
	[ 'bol/translation', { locale: 'es', label: '🇪🇸 Español' } ],
];

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'bol-localized-content-editor',
	} );

	return (
		<div { ...blockProps }>
			<div className="bol-localized-content-editor__label">
				{ __( 'Localized Content', 'bol-easy-translations' ) }
			</div>
			<InnerBlocks
				allowedBlocks={ ALLOWED_BLOCKS }
				template={ TEMPLATE }
				orientation="horizontal"
			/>
		</div>
	);
}
