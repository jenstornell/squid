<?php include __DIR__ . '/core/helpers.php'; ?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  
  <link rel="icon" href="http://www.vardagsfinans.se/assets/images/vardagsfinans.se/favicon.png">

  <title>Smslån och snabblån</title>
  
  <link rel="stylesheet" href="<?= url('assets/css/dist/style.css?t=' . time()); ?>">
</head>
<body>

<main>
  <h1>MySQL Query Tester</h1>

  <div id="form">
    <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">select * from products</textarea>
    <button>
      <img src="<?= url('assets/images/play.svg'); ?>">
    </button>
  </div>
</main>

<div id="results"></div>

<script src="<?= url('assets/js/dist/script.js?t=' . time() ); ?>"></script>
<script>
new MySqlQueryTester();
</script>

</body>
</html>
