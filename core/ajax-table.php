<?php
include __DIR__ . '/../libs/sql-formatter.php';

$sql = file_get_contents('php://input');
file_put_contents(__DIR__ . '/../cache/latest.txt', $sql);

$formatted = SqlFormatter::format($sql);

$config = include __DIR__ . '/../config.php';

$db = new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['name']), $config['user'], $config['pass']);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);

try {
  $stmt = $db->prepare($sql);
  $stmt->execute();
  $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $affected_rows = count($data);
} catch(Exception $e) {
  $message = $e;
}
?>

<?php if(isset($data)) : ?>

<div class="meta">
  <details>
    <summary>Format SQL</summary>
    <?= $formatted; ?>
  </details>

  <div class="affected-rows">
    <strong>Affected rows:</strong> <?= $affected_rows; ?>
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
            <td title="<?= $test; ?>"><?= $test; ?></td>
          <?php endforeach; ?>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<?php else : ?>
  <div class="message message-error"><?= $message; ?></div>
<?php endif;