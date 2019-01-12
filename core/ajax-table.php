<?php
include __DIR__ . '/../libs/sql-formatter.php';
include __DIR__ . '/../libs/tinyoptions.php';
include __DIR__ . '/../setup.php';

$sql = file_get_contents('php://input');
$root_path = __DIR__ . '/../';
$folder_path = $root_path . 'cache';
$file_path = $folder_path . '/latest.txt';

if(!file_exists($folder_path)) {
  mkdir($folder_path);
}

if(!file_exists($file_path)) {
  file_put_contents($file_path, $sql);
}

$formatted = SqlFormatter::format($sql);
$charset = (isset(option('db')['charset'])) ? option('db')['charset'] : 'utf8mb4';

$db = new PDO(
  sprintf(
    'mysql:host=%s;dbname=%s;charset=%s',
    option('db')['host'],
    option('db')['name'],
    $charset
  ),
  option('db')['user'],
  option('db')['pass'],
  [PDO::MYSQL_ATTR_MULTI_STATEMENTS => false]
);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);

if(option('select_only', true) === true) {
  $allowed = preg_match('/^(\s+)?SELECT/i', $sql);
} else {
  $allowed = true;
}

if($allowed) {
  try {
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $found_rows = count($data);
  } catch(Exception $e) {
    $message = $e;
  }
} else {
  $message = 'Please use a SELECT query or change your options.';
}
?>

<?php if(isset($data)) : ?>

<div class="meta">
  <details>
    <summary>Format SQL</summary>
    <?= $formatted; ?>
  </details>

  <div class="found-rows">
    <strong>Found rows:</strong> <?= $found_rows; ?>
  </div>
</div>

<div id="thead-wrap">
  <div id="thead">
    <?php foreach($data[0] as $key => $value) : ?>
      <div class="th"><?= $key; ?></div>
    <?php endforeach;  ?>
  </div>
</div>

<div id="table">
  <table>
    <thead>
      <tr>
        <?php foreach($data[0] as $key => $value) : ?>
          <th><?= $key; ?></th>
        <?php endforeach;  ?>
      </tr>
    </thead>

    <tbody>
      <?php foreach($data as $i => $item) : ?>
        <tr>
          <?php foreach($item as $j => $test) : ?>
            <td>
              <div class="td"><?= $test; ?></div>
            </td>
          <?php endforeach; ?>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php else : ?>
  <div class="message message-error"><?= $message; ?></div>
<?php endif;