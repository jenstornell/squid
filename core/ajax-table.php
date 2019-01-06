<?php
$sql = file_get_contents('php://input');

$config = include __DIR__ . '/../config.php';

$db = new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['name']), $config['user'], $config['pass']);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$db->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false);

try {
  $stmt = $db->prepare($sql);
  $stmt->execute();
  $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(Exception $e) {
  $message = $e;
}
?>

<?php if(isset($data)) : ?>
<table>
  <tr>
    <?php foreach($data[0] as $key => $value) : ?>
      <th><?= $key; ?></th>
    <?php endforeach;  ?>
  </tr>

  <?php foreach($data as $i => $item) : ?>
    <tr>
      <?php foreach($item as $j => $test) : ?>
        <td><?= $test; ?></td>
      <?php endforeach; ?>
    </tr>
  <?php endforeach; ?>
</table>
<?php else : ?>
  <div class="message message-error"><?= $message; ?></div>
<?php endif;