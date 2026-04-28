<?php
/**
 * REST API endpoint for AI-powered translation.
 *
 * Uses the WordPress 7.0 core AI Client (WordPress\AiClient\AiClient) for text
 * generation. Any connector configured in Settings > Connectors is used automatically.
 *
 * @package Bol
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', 'bol_register_rest_routes' );

/**
 * Registers the bol/v1/translate REST endpoint.
 */
function bol_register_rest_routes() {
	register_rest_route(
		'bol/v1',
		'/translate',
		[
			'methods'             => WP_REST_Server::CREATABLE,
			'callback'            => 'bol_translate_content',
			'permission_callback' => static function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => [
				'source_locale' => [
					'type'              => 'string',
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				],
				'target_locale' => [
					'type'              => 'string',
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				],
				'items'         => [
					'type'     => 'array',
					'required' => true,
					'items'    => [
						'type'       => 'object',
						'properties' => [
							'id'   => [ 'type' => 'string' ],
							'html' => [ 'type' => 'string' ],
						],
					],
				],
			],
		]
	);
}

/**
 * Translates a set of HTML content items using the WordPress core AI Client.
 *
 * @param WP_REST_Request $request REST request containing source_locale, target_locale, and items.
 * @return WP_REST_Response|WP_Error
 */
function bol_translate_content( WP_REST_Request $request ) {
	$source_locale = $request->get_param( 'source_locale' );
	$target_locale = $request->get_param( 'target_locale' );
	$raw_items     = $request->get_param( 'items' );

	$items = [];
	foreach ( (array) $raw_items as $item ) {
		$id   = isset( $item['id'] ) ? sanitize_text_field( $item['id'] ) : '';
		$html = isset( $item['html'] ) ? wp_kses_post( $item['html'] ) : '';
		if ( $id && $html ) {
			$items[] = [
				'id'   => $id,
				'html' => $html,
			];
		}
	}

	if ( empty( $items ) ) {
		return new WP_Error(
			'no_content',
			__( 'No translatable content provided.', 'bol-easy-translations' ),
			[ 'status' => 400 ]
		);
	}

	$items_json = wp_json_encode( $items );
	$prompt     = sprintf(
		"Translate the following HTML content from locale \"%1\$s\" to locale \"%2\$s\".\n"
		. "Rules:\n"
		. "- Preserve all HTML tags and attributes exactly — only translate visible text.\n"
		. "- Keep each item's \"id\" value unchanged.\n"
		. "- Return ONLY a valid JSON array of {\"id\",\"html\"} objects. No prose, no markdown fences.\n\n"
		. '%3$s',
		$source_locale,
		$target_locale,
		$items_json
	);

	try {
		$result = \WordPress\AiClient\AiClient::generateTextResult( $prompt );
		$text   = $result->toText();

		// Strip any markdown code fences the model may have added.
		$text = trim( $text );
		$text = (string) preg_replace( '/^```(?:json)?\n?/i', '', $text );
		$text = (string) preg_replace( '/\n?```$/i', '', $text );
		$text = trim( $text );

		$translated = json_decode( $text, true );

		if ( ! is_array( $translated ) ) {
			return new WP_Error(
				'translation_parse_error',
				__( 'The AI service returned an unexpected format. Please try again.', 'bol-easy-translations' ),
				[ 'status' => 502 ]
			);
		}

		$translated = array_values(
			array_filter(
				$translated,
				static function ( $item ) {
					return is_array( $item ) && isset( $item['id'], $item['html'] );
				}
			)
		);

		return rest_ensure_response( [ 'items' => $translated ] );

	} catch ( \Throwable $e ) {
		return new WP_Error(
			'ai_client_error',
			$e->getMessage(),
			[ 'status' => 500 ]
		);
	}
}
