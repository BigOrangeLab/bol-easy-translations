<?php
// This file is generated. Do not modify it manually.
return array(
	'localized-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'bol/localized-content',
		'version' => '0.1.0',
		'title' => 'Localized Content',
		'category' => 'text',
		'icon' => 'translation',
		'description' => 'Container for multiple language translations with a front-end language switcher.',
		'keywords' => array(
			'translation',
			'localization',
			'language',
			'i18n'
		),
		'example' => array(
			
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			)
		),
		'textdomain' => 'bol-easy-translations',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'translation' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'bol/translation',
		'version' => '0.1.0',
		'title' => 'Translation',
		'category' => 'text',
		'icon' => 'flag',
		'description' => 'A translation variant for a specific locale. Place inside a Localized Content block.',
		'keywords' => array(
			'translation',
			'locale',
			'language'
		),
		'parent' => array(
			'bol/localized-content'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'inserter' => false
		),
		'attributes' => array(
			'locale' => array(
				'type' => 'string',
				'default' => 'en'
			),
			'label' => array(
				'type' => 'string',
				'default' => 'English'
			)
		),
		'textdomain' => 'bol-easy-translations',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	)
);
