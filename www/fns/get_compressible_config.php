<?php

function get_compressible_config() {
    return [
        'index' => [
            'css' => [
                'targetName' => 'css/compressed.min.css',
                'targetUrl' => 'css/compressed.min.css',
                'targetDir' => __DIR__ . '/../css/',
                'directory' => __DIR__ . '/../',
                'files' => [
                    'vendor/bootstrap/css/bootstrap.min.css',
                    'vendor/font-awesome/css/font-awesome.min.css',
                ]
            ],
            'js' => [
                'targetName' => 'js/compressed.min.js',
                'targetUrl' => 'js/compressed.min.js',
                'targetDir' => __DIR__ . '/../js/',
                'directory' => __DIR__ . '/../',
                'files' => [
                    'vendor/jquery/jquery.min.js',
                    'vendor/bootstrap/js/bootstrap.min.js',
                ]
            ]
        ]
    ];
}