<?php include __DIR__ . '/core/helpers.php'; ?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  
  <?php /*
  <link rel="icon" href="http://www.vardagsfinans.se/assets/images/vardagsfinans.se/favicon.png">
  */
  ?>

  <title>Squid</title>
  
  <link rel="stylesheet" href="<?= url('assets/css/dist/style.css?t=' . time()); ?>">
</head>
<body>

<nav>
  <ul>
    <li>
      <a href="">Squid</a>
    </li>
    <li>
      <div>
        <img src="<?= url('assets/images/play.svg'); ?>">
      </div>
    </li>
  </ul>
</nav>

<main>
  <div id="form">
    <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">select * from products</textarea>
    <button>
      <img src="<?= url('assets/images/play.svg'); ?>">
    </button>
  </div>
</main>

<div style="width: 100%; overflow-x: auto;">
  <div class="syncscroll" name="sync" id="scrollbar" style="width: 2500px;">e</div>
</div>

<div class="syncscroll" name="sync" id="results"></div>

<script src="<?= url('assets/js/dist/script.js?t=' . time() ); ?>"></script>
<script>
new MySqlQueryTester();
</script>

</body>
</html>
