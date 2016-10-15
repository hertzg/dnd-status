<?php
function render_script_tags($compressibleName, $compressibles) {
    require_once __DIR__ . '/get_debug.php';
    if (!get_debug()) {
        $compressedJs = $compressibles[$compressibleName]['js']['targetUrl'];
        return '<script type="text/javascript" src="' . $compressedJs . '"></script>';
    }
    $compressible = $compressibles[$compressibleName]['js'];
    $html = '';
    foreach ($compressible['files'] as $jsFilename) {
        $html .= '<script type="text/javascript" src="' . $jsFilename . '"></script>';
    }
    return $html;
}