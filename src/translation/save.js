import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { locale, label } = attributes;

	const blockProps = useBlockProps.save( {
		'data-locale': locale,
		'data-label': label,
		lang: locale,
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
