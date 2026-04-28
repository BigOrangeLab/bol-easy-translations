import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	BlockControls,
} from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	ToolbarGroup,
	ToolbarButton,
	Modal,
	SelectControl,
	Button,
	Notice,
	Spinner,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';
import { LOCALES, getTabLabel } from '../translation/locales';

const ALLOWED_BLOCKS = [ 'bol/translation' ];

const TEMPLATE = [
	[ 'bol/translation', { locale: 'en', label: '🇺🇸 English' } ],
	[ 'bol/translation', { locale: 'es', label: '🇪🇸 Español' } ],
];

/** Block types → HTML attributes that contain translatable text. */
const TRANSLATABLE_ATTRS = {
	'core/paragraph': [ 'content' ],
	'core/heading': [ 'content' ],
	'core/list-item': [ 'content' ],
	'core/button': [ 'text' ],
	'core/image': [ 'caption', 'alt' ],
	'core/pullquote': [ 'value', 'citation' ],
	'core/quote': [ 'citation' ],
	'core/verse': [ 'content' ],
};

/**
 * Walk the block tree and collect { id, html } pairs for translation.
 * IDs encode the block path so applyTranslations can map them back.
 * @param {Array}  blocks Array of block objects from the editor store.
 * @param {string} prefix Dot-separated path prefix (empty for root).
 * @return {Array} Flat array of { id, html } items.
 */
function extractTranslatables( blocks, prefix = '' ) {
	const items = [];
	blocks.forEach( ( block, i ) => {
		const path = prefix ? `${ prefix }.${ i }` : String( i );
		const attrs = TRANSLATABLE_ATTRS[ block.name ];
		if ( attrs ) {
			attrs.forEach( ( attr ) => {
				const val = block.attributes?.[ attr ];
				if ( val ) {
					items.push( { id: `${ path }:${ attr }`, html: val } );
				}
			} );
		}
		if ( block.innerBlocks?.length ) {
			items.push( ...extractTranslatables( block.innerBlocks, path ) );
		}
	} );
	return items;
}

/**
 * Re-walk the block tree, substituting translated strings from translationMap.
 * @param {Array}  blocks         Block objects mirroring the source tree.
 * @param {Object} translationMap Map of id → translated html string.
 * @param {string} prefix         Must match the prefix used in extractTranslatables.
 * @return {Array} New blocks created with translated attributes.
 */
function applyTranslations( blocks, translationMap, prefix = '' ) {
	return blocks.map( ( block, i ) => {
		const path = prefix ? `${ prefix }.${ i }` : String( i );
		const attrs = TRANSLATABLE_ATTRS[ block.name ];
		const newAttributes = { ...block.attributes };

		if ( attrs ) {
			attrs.forEach( ( attr ) => {
				const key = `${ path }:${ attr }`;
				if ( key in translationMap ) {
					newAttributes[ attr ] = translationMap[ key ];
				}
			} );
		}

		const newInnerBlocks = block.innerBlocks?.length
			? applyTranslations( block.innerBlocks, translationMap, path )
			: [];

		return createBlock( block.name, newAttributes, newInnerBlocks );
	} );
}

export default function Edit( { clientId } ) {
	const blockProps = useBlockProps( {
		className: 'bol-localized-content-editor',
	} );

	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ sourceClientId, setSourceClientId ] = useState( '' );
	const [ targetLocale, setTargetLocale ] = useState( '' );
	const [ isTranslating, setIsTranslating ] = useState( false );
	const [ errorMessage, setErrorMessage ] = useState( '' );

	const translationBlocks = useSelect(
		( select ) =>
			(
				select( 'core/block-editor' ).getBlock( clientId )
					?.innerBlocks ?? []
			).filter( ( b ) => b.name === 'bol/translation' ),
		[ clientId ]
	);

	const translationClientIds = translationBlocks.map( ( b ) => b.clientId );

	const { updateBlockAttributes, insertBlock } =
		useDispatch( 'core/block-editor' );

	const idsKey = translationClientIds.join( ',' );

	useEffect( () => {
		const lock =
			translationClientIds.length <= 2 ? { remove: true } : undefined;
		translationClientIds.forEach( ( id ) =>
			updateBlockAttributes( id, { lock } )
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ idsKey ] );

	// Keep sourceClientId pointed at a valid block as the set changes.
	useEffect( () => {
		if ( ! sourceClientId && translationBlocks.length > 0 ) {
			setSourceClientId( translationBlocks[ 0 ].clientId );
		}
	}, [ translationBlocks, sourceClientId ] );

	const sourceOptions = translationBlocks.map( ( b ) => ( {
		value: b.clientId,
		label: b.attributes.label || b.attributes.locale || b.clientId,
	} ) );

	const usedLocales = new Set(
		translationBlocks.map( ( b ) => b.attributes.locale )
	);
	const targetLocaleOptions = [
		{
			value: '',
			label: __( '— Select a language —', 'bol-easy-translations' ),
		},
		...LOCALES.filter( ( l ) => ! usedLocales.has( l.value ) ).map(
			( l ) => ( { value: l.value, label: `${ l.flag } ${ l.label }` } )
		),
	];

	function openModal() {
		setErrorMessage( '' );
		setTargetLocale( '' );
		setIsModalOpen( true );
	}

	async function handleTranslate() {
		if ( ! targetLocale ) {
			setErrorMessage(
				__(
					'Please select a target language.',
					'bol-easy-translations'
				)
			);
			return;
		}

		const sourceBlock = translationBlocks.find(
			( b ) => b.clientId === sourceClientId
		);
		if ( ! sourceBlock ) {
			setErrorMessage(
				__( 'Source translation not found.', 'bol-easy-translations' )
			);
			return;
		}

		const items = extractTranslatables( sourceBlock.innerBlocks );
		if ( items.length === 0 ) {
			setErrorMessage(
				__(
					'No translatable text found in the source translation.',
					'bol-easy-translations'
				)
			);
			return;
		}

		setIsTranslating( true );
		setErrorMessage( '' );

		try {
			const response = await apiFetch( {
				path: '/bol/v1/translate',
				method: 'POST',
				data: {
					source_locale: sourceBlock.attributes.locale,
					target_locale: targetLocale,
					items,
				},
			} );

			const translationMap = {};
			( response.items ?? [] ).forEach( ( item ) => {
				translationMap[ item.id ] = item.html;
			} );

			const translatedInnerBlocks = applyTranslations(
				sourceBlock.innerBlocks,
				translationMap
			);

			const newBlock = createBlock(
				'bol/translation',
				{
					locale: targetLocale,
					label: getTabLabel( targetLocale ),
				},
				translatedInnerBlocks
			);

			insertBlock( newBlock, translationBlocks.length, clientId );
			setIsModalOpen( false );
		} catch ( err ) {
			setErrorMessage(
				err?.message ??
					__(
						'Translation failed. Please try again.',
						'bol-easy-translations'
					)
			);
		} finally {
			setIsTranslating( false );
		}
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="translation"
						label={ __(
							'Auto-translate',
							'bol-easy-translations'
						) }
						onClick={ openModal }
					/>
				</ToolbarGroup>
			</BlockControls>

			{ isModalOpen && (
				<Modal
					title={ __(
						'Generate Translation',
						'bol-easy-translations'
					) }
					onRequestClose={ () => setIsModalOpen( false ) }
					className="bol-translate-modal"
				>
					{ errorMessage && (
						<Notice status="error" isDismissible={ false }>
							{ errorMessage }
						</Notice>
					) }
					<SelectControl
						label={ __(
							'Translate from',
							'bol-easy-translations'
						) }
						value={ sourceClientId }
						options={ sourceOptions }
						onChange={ setSourceClientId }
					/>
					<SelectControl
						label={ __( 'Translate to', 'bol-easy-translations' ) }
						value={ targetLocale }
						options={ targetLocaleOptions }
						onChange={ setTargetLocale }
					/>
					<div className="bol-translate-modal__footer">
						{ isTranslating ? (
							<Spinner />
						) : (
							<Button
								variant="primary"
								onClick={ handleTranslate }
								disabled={ ! targetLocale }
							>
								{ __(
									'Generate Translation',
									'bol-easy-translations'
								) }
							</Button>
						) }
						<Button
							variant="secondary"
							onClick={ () => setIsModalOpen( false ) }
							disabled={ isTranslating }
						>
							{ __( 'Cancel', 'bol-easy-translations' ) }
						</Button>
					</div>
				</Modal>
			) }

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
		</>
	);
}
