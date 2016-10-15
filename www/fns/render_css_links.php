<?php
function render_css_links($compressibleName, $compressibles) {
    require_once __DIR__ . '/get_debug.php';
    if (!get_debug()) {
        $compressedCss = $compressibles[$compressibleName]['css']['targetUrl'];
        return '<link rel="stylesheet" type="text/css" href="' . $compressedCss . '" />';
    }
    $compressible = $compressibles[$compressibleName]['css'];
    $html = '';
    foreach ($compressible['files'] as $cssFilename) {
        $html .= '<link rel="stylesheet" type="text/css" href="' . $cssFilename . '" />';
    }
    return $html;
}