<?php
/**
 * Plugin Name:       BOL Easy Translations
 * Description:       Localized content blocks with a language switcher
 * Version:           1.0.0
 * Requires at least: 7.0
 * Requires PHP:      7.4
 * Author:            George Stephanis, Big Orange Lab
 * Author URI:        https://bigorangelab.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bol-easy-translations
 *
 * @package Bol
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers both block types from the pre-built manifest.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 */
function bol_bol_easy_translations_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'bol_bol_easy_translations_block_init' );

require_once __DIR__ . '/includes/rest-api.php';
