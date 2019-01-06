<?php
$sql = file_get_contents('php://input');
include __DIR__ . '/../libs/sql-formatter.php';
echo SqlFormatter::format($sql);
file_put_contents(__DIR__ . '/../cache/latest.txt', $sql);