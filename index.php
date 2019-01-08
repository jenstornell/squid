<?php
include __DIR__ . '/libs/tinyoptions.php';
include __DIR__ . '/setup.php';
include __DIR__ . '/core/helpers.php';

if(option('cell_max_width') != '') {
  $max_width = option('cell_max_width');
  $style = "
    th, td {
      max-width: " . $max_width . "px;
    }
  ";
}
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  
  <link rel="icon" href="<?= url('assets/images/favicon.png'); ?>">

  <title>Squid</title>
  
  <link rel="stylesheet" href="<?= url('assets/css/dist/style.css?t=' . time()); ?>">

  <style>
    <?= $style; ?>
  </style>
</head>
<body>

<main>
  <div id="form">
    <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><?php
    $path = __DIR__ . '/cache/latest.txt';
    if(file_exists($path)) {
      echo file_get_contents($path);
    }
    ?></textarea>
    <button>
      <img src="<?= url('assets/images/play.svg'); ?>">
    </button>
  </div>
</main>

<div class="scrollbar-wrap">
  <div class="syncscroll" name="sync" id="scrollbar"></div>
</div>

<div id="results"></div>

<script src="<?= url('assets/js/dist/script.js?t=' . time() ); ?>"></script>
<script>
new MySqlQueryTester();
autosize(document.querySelector('textarea'));
</script>

</body>
</html>
