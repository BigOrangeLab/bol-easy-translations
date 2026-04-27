<?php
/**
 * Playground demo-content setup for BOL Easy Translations.
 * Included by blueprint.json's runPHP step after the plugin is installed.
 * wp-load.php is already required by the calling step.
 */

// ---------------------------------------------------------------------------
// Section 1: Company overview — English / Español / Français
// ---------------------------------------------------------------------------
$section_about = <<<'BLOCK'
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Example 1 — Company Overview (EN / ES / FR)</h2>
<!-- /wp:heading -->

<!-- wp:bol/localized-content -->
<div class="wp-block-bol-localized-content"><!-- wp:bol/translation {"locale":"en","label":"🇺🇸 English"} -->
<div class="wp-block-bol-translation" data-locale="en" data-label="🇺🇸 English" lang="en"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">About Acme Corp</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Founded in 2015, Acme Corp builds tools that help content teams communicate across borders without duplicating effort. Our mission is to make multilingual publishing as easy as writing in a single language.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Headquartered in Boston, we serve customers in over 40 countries and support more than 50 languages through integrations with leading translation services.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:bol/translation -->

<!-- wp:bol/translation {"locale":"es","label":"🇪🇸 Español"} -->
<div class="wp-block-bol-translation" data-locale="es" data-label="🇪🇸 Español" lang="es"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Sobre Acme Corp</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Fundada en 2015, Acme Corp desarrolla herramientas que ayudan a los equipos de contenido a comunicarse más allá de las fronteras sin duplicar esfuerzos. Nuestra misión es que publicar en varios idiomas sea tan fácil como escribir en uno solo.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Con sede en Boston, atendemos a clientes en más de 40 países y admitimos más de 50 idiomas mediante integraciones con los principales servicios de traducción.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:bol/translation -->

<!-- wp:bol/translation {"locale":"fr","label":"🇫🇷 Français"} -->
<div class="wp-block-bol-translation" data-locale="fr" data-label="🇫🇷 Français" lang="fr"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">À propos d'Acme Corp</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Fondée en 2015, Acme Corp développe des outils qui aident les équipes de contenu à communiquer au-delà des frontières sans dupliquer les efforts. Notre mission est de rendre la publication multilingue aussi simple que la rédaction dans une seule langue.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Basés à Boston, nous servons des clients dans plus de 40 pays et prenons en charge plus de 50 langues grâce à des intégrations avec les principaux services de traduction.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:bol/translation --></div>
<!-- /wp:bol/localized-content -->
BLOCK;

// ---------------------------------------------------------------------------
// Section 2: Product features with a list — English / Deutsch / 日本語
// ---------------------------------------------------------------------------
$section_features = <<<'BLOCK'
<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Example 2 — Feature List (EN / DE / JA)</h2>
<!-- /wp:heading -->

<!-- wp:bol/localized-content -->
<div class="wp-block-bol-localized-content"><!-- wp:bol/translation {"locale":"en","label":"🇺🇸 English"} -->
<div class="wp-block-bol-translation" data-locale="en" data-label="🇺🇸 English" lang="en"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Key Features</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Everything you need to publish multilingual content directly in the WordPress block editor:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Nest any block inside a Translation panel — paragraphs, images, columns, and more</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Front-end language switcher generated automatically from your translations</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Visitor preference remembered via <code>localStorage</code> and the <code>?lang=</code> URL parameter</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Browser language auto-detected via <code>navigator.languages</code></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Works without JavaScript — first translation shown as a static fallback</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:bol/translation -->

<!-- wp:bol/translation {"locale":"de","label":"🇩🇪 Deutsch"} -->
<div class="wp-block-bol-translation" data-locale="de" data-label="🇩🇪 Deutsch" lang="de"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Hauptfunktionen</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Alles, was Sie benötigen, um mehrsprachige Inhalte direkt im WordPress-Block-Editor zu veröffentlichen:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Beliebige Blöcke in einem Übersetzungsbereich verschachteln — Absätze, Bilder, Spalten und mehr</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Sprachumschalter für das Frontend wird automatisch aus Ihren Übersetzungen generiert</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Benutzereinstellung wird über <code>localStorage</code> und den URL-Parameter <code>?lang=</code> gespeichert</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Browsersprache wird automatisch über <code>navigator.languages</code> erkannt</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Funktioniert ohne JavaScript — erste Übersetzung wird als statischer Fallback angezeigt</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:bol/translation -->

<!-- wp:bol/translation {"locale":"ja","label":"🇯🇵 日本語"} -->
<div class="wp-block-bol-translation" data-locale="ja" data-label="🇯🇵 日本語" lang="ja"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">主な機能</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>WordPressブロックエディターで多言語コンテンツを直接公開するために必要なすべての機能：</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>翻訳パネル内に任意のブロックをネスト可能 — 段落、画像、カラムなど</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>翻訳から自動的に生成されるフロントエンドの言語切替ウィジェット</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><code>localStorage</code>とURLパラメータ<code>?lang=</code>を通じて訪問者の言語設定を記憶</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><code>navigator.languages</code>によるブラウザ言語の自動検出</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>JavaScriptなしでも動作 — 最初の翻訳が静的フォールバックとして表示</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:bol/translation --></div>
<!-- /wp:bol/localized-content -->
BLOCK;

// ---------------------------------------------------------------------------
// Section 3: Event announcement with non-Latin scripts
//   English / Português (BR) / 中文（简体） / 한국어
// ---------------------------------------------------------------------------
$section_event = <<<'BLOCK'
<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Example 3 — Event Announcement (EN / PT-BR / ZH / KO)</h2>
<!-- /wp:heading -->

<!-- wp:bol/localized-content -->
<div class="wp-block-bol-localized-content"><!-- wp:bol/translation {"locale":"en","label":"🇺🇸 English"} -->
<div class="wp-block-bol-translation" data-locale="en" data-label="🇺🇸 English" lang="en"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Global Community Meetup — Spring 2025</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We're hosting our annual global meetup on <strong>May 10th, 2025</strong> in cities across six continents. Join thousands of fellow users for workshops, demos, and networking.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Registration is free and open to everyone. Simultaneous interpretation will be available in twelve languages.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:bol/translation -->

<!-- wp:bol/translation {"locale":"pt-BR","label":"🇧🇷 Português (BR)"} -->
<div class="wp-block-bol-translation" data-locale="pt-BR" data-label="🇧🇷 Português (BR)" lang="pt-BR"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Encontro Global da Comunidade — Primavera 2025</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Estamos realizando nosso encontro global anual no dia <strong>10 de maio de 2025</strong> em cidades de seis continentes. Junte-se a milhares de usuários para workshops, demonstrações e networking.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>A inscrição é gratuita e aberta a todos. Interpretação simultânea estará disponível em doze idiomas.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:bol/translation -->

<!-- wp:bol/translation {"locale":"zh-CN","label":"🇨🇳 中文（简体）"} -->
<div class="wp-block-bol-translation" data-locale="zh-CN" data-label="🇨🇳 中文（简体）" lang="zh-CN"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">全球社区聚会 — 2025年春季</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>我们将于 <strong>2025年5月10日</strong> 在六大洲的多个城市举办年度全球聚会。与数千名用户一起参加研讨会、演示和交流活动。</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>注册免费，所有人均可参加。将提供十二种语言的同声传译。</p>
<!-- /wp:paragraph --></div>
<!-- /wp:bol/translation -->

<!-- wp:bol/translation {"locale":"ko","label":"🇰🇷 한국어"} -->
<div class="wp-block-bol-translation" data-locale="ko" data-label="🇰🇷 한국어" lang="ko"><!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">글로벌 커뮤니티 미트업 — 2025년 봄</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>저희는 <strong>2025년 5월 10일</strong>에 6개 대륙의 여러 도시에서 연례 글로벌 미트업을 개최합니다. 수천 명의 사용자들과 함께 워크숍, 데모, 네트워킹에 참여하세요.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>등록은 무료이며 모든 분께 열려 있습니다. 12개 언어로 동시 통역이 제공됩니다.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:bol/translation --></div>
<!-- /wp:bol/localized-content -->
BLOCK;

// ---------------------------------------------------------------------------
// Insert demo page and configure site
// ---------------------------------------------------------------------------
$demo_id = wp_insert_post( [
	'post_title'   => 'BOL Easy Translations — Live Demo',
	'post_content' => $section_about . "\n\n" . $section_features . "\n\n" . $section_event,
	'post_status'  => 'publish',
	'post_type'    => 'page',
] );

update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $demo_id );
update_option( 'blogname', 'BOL Easy Translations Demo' );
update_option( 'blogdescription', 'A WordPress block plugin by Big Orange Lab' );
