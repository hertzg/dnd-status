<?php
function get_debug() {
    return false && $_SERVER['HTTP_HOST'] === 'localhost'
    || $_SERVER['HTTP_HOST'] === '127.0.0.1';
}