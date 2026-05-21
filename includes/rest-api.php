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

/** Maximum number of items accepted per translate request. */
const BOL_TRANSLATE_MAX_ITEMS = 100;

/** Maximum HTML character length allowed for a single item. */
const BOL_TRANSLATE_MAX_ITEM_CHARS = 10000;

/** Maximum total HTML character length across all items. */
const BOL_TRANSLATE_MAX_TOTAL_CHARS = 100000;

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

	if ( count( $items ) > BOL_TRANSLATE_MAX_ITEMS ) {
		return new WP_Error(
			'too_many_items',
			sprintf(
				/* translators: %d: maximum number of items allowed */
				__( 'Too many items. Maximum allowed is %d.', 'bol-easy-translations' ),
				BOL_TRANSLATE_MAX_ITEMS
			),
			[ 'status' => 400 ]
		);
	}

	$total_chars = 0;
	foreach ( $items as $item ) {
		$item_len = mb_strlen( $item['html'], 'UTF-8' );
		if ( $item_len > BOL_TRANSLATE_MAX_ITEM_CHARS ) {
			return new WP_Error(
				'item_too_large',
				sprintf(
					/* translators: %d: maximum number of characters per item */
					__( 'One or more items exceed the maximum allowed length of %d characters.', 'bol-easy-translations' ),
					BOL_TRANSLATE_MAX_ITEM_CHARS
				),
				[ 'status' => 400 ]
			);
		}
		$total_chars += $item_len;
	}

	if ( $total_chars > BOL_TRANSLATE_MAX_TOTAL_CHARS ) {
		return new WP_Error(
			'payload_too_large',
			sprintf(
				/* translators: %d: maximum total characters allowed */
				__( 'Total content exceeds the maximum allowed size of %d characters.', 'bol-easy-translations' ),
				BOL_TRANSLATE_MAX_TOTAL_CHARS
			),
			[ 'status' => 413 ]
		);
	}

	// Build an allowlist of the requested IDs so the AI response can be constrained to them.
	$requested_ids = array_fill_keys( array_column( $items, 'id' ), true );

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
		/*
		 * Disable Qwen3/DeepSeek-style extended thinking for translation requests.
		 * Without this, thinking models spend 30+ seconds on chain-of-thought before
		 * emitting any output, triggering cURL's low-speed timeout (< 1024 bytes/sec
		 * for 30 s). The custom option is forwarded verbatim to the OpenAI-compatible
		 * payload by AbstractOpenAiCompatibleTextGenerationModel::prepareGenerateTextParams().
		 */
		$model_config = new \WordPress\AiClient\Providers\Models\DTO\ModelConfig();
		$model_config->setCustomOption( 'chat_template_kwargs', [ 'enable_thinking' => false ] );

		$result = \WordPress\AiClient\AiClient::generateTextResult( $prompt, $model_config );
		$text   = $result->toText();

		// Reasoning models (DeepSeek, QwQ, etc.) prepend their chain-of-thought
		// inside <think>…</think> blocks before the actual answer.
		$text = (string) preg_replace( '/<think>.*?<\/think>/is', '', $text );

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

		$seen_ids   = [];
		$translated = array_values(
			array_filter(
				$translated,
				static function ( $item ) use ( $requested_ids, &$seen_ids ) {
					if ( ! is_array( $item ) || ! isset( $item['id'], $item['html'] ) ) {
						return false;
					}
					// Reject IDs the client never sent (hallucinated) and duplicates.
					if ( ! isset( $requested_ids[ $item['id'] ] ) || isset( $seen_ids[ $item['id'] ] ) ) {
						return false;
					}
					$seen_ids[ $item['id'] ] = true;
					return true;
				}
			)
		);

		// Sanitize the AI-generated HTML before returning it to the client.
		$translated = array_map(
			static function ( $item ) {
				$item['html'] = wp_kses_post( $item['html'] );
				return $item;
			},
			$translated
		);

		return rest_ensure_response( [ 'items' => $translated ] );

	} catch ( \Throwable $e ) {
		error_log( 'BOL Easy Translations: AI translation failed: ' . $e->getMessage() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		return new WP_Error(
			'ai_client_error',
			__( 'Translation failed due to an internal error. Please try again.', 'bol-easy-translations' ),
			[ 'status' => 500 ]
		);
	}
}
