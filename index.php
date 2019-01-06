<?php include __DIR__ . '/core/helpers.php'; ?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  
  <link rel="icon" href="<?= url('assets/images/favicon.png'); ?>">

  <title>Squid</title>
  
  <link rel="stylesheet" href="<?= url('assets/css/dist/style.css?t=' . time()); ?>">
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

  <div id="query"></div>
</main>

<div class="scrollbar-wrap">
  <div class="syncscroll" name="sync" id="scrollbar"></div>
</div>

<div class="syncscroll" name="sync" id="results"></div>

<script src="<?= url('assets/js/dist/script.js?t=' . time() ); ?>"></script>
<script>
new MySqlQueryTester();
</script>

</body>
</html>
