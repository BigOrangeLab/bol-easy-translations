import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

const ALLOWED_BLOCKS = [ 'bol/translation' ];

const TEMPLATE = [
	[ 'bol/translation', { locale: 'en', label: '🇺🇸 English' } ],
	[ 'bol/translation', { locale: 'es', label: '🇪🇸 Español' } ],
];

export default function Edit( { clientId } ) {
	const blockProps = useBlockProps( {
		className: 'bol-localized-content-editor',
	} );

	// Collect the clientIds of all direct Translation inner blocks.
	const translationClientIds = useSelect(
		( select ) =>
			(
				select( 'core/block-editor' ).getBlock( clientId )
					?.innerBlocks ?? []
			)
				.filter( ( b ) => b.name === 'bol/translation' )
				.map( ( b ) => b.clientId ),
		[ clientId ]
	);

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	// Serialise the id list to a stable primitive so the effect only fires
	// when the actual set of blocks changes, not on every render.
	const idsKey = translationClientIds.join( ',' );

	useEffect( () => {
		// When exactly two translations remain, lock removal on both so the
		// block can't be reduced to a single (pointless) translation.
		// Release the lock once a third block exists so deleting is free again.
		const lock =
			translationClientIds.length <= 2 ? { remove: true } : undefined;
		translationClientIds.forEach( ( id ) =>
			updateBlockAttributes( id, { lock } )
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ idsKey ] );

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
