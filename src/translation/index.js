import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import './editor.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	__experimentalLabel( { locale, label } ) {
		if ( label && locale ) {
			return `${ label } (${ locale })`;
		}
		return label || locale || undefined;
	},
} );
