# Squid

##  In short

- The textarea will autosize
- Latest SQL query saved to disc
- Format the SQL query
- See count of affected rows
- Fixed table scrollbar

## Setup

## Usage

### SQL Query

Write the SQL query in the textarea and press the button and it will run it and display the results below. While you write, the textarea will autosize to content height.

So far only SELECT queries are supported. No other queries can display a result.

Every time you run a query, it will also be saved to disc. If something bad happends, the query will still be saved when you refresh the page.

### Format SQL

Maybe you need a formatted SQL query with syntax highlighting. Here you can get it.

### Affected rows

A row counter of found rows.

### Table

If the SQL query is valid the data will be displayed as a table. I recommend to use `LIMIT`, else it will be slow with many rows.

## Options

You can add options to `setup.php` placed in the root.

### cell_max_width

In some cases database rows can be very long. To prevent that you can set `cell_max_width` to something like `200`, which will be 200 pixels.

If you want to see a particular value again, you can hover the table cell to get a tooltip.

```php
option::set([
  'cell_max_width' => 200
]);
```

## Requirements

- PHP7
- ES6 supported browser like Google Chrome

## Libraries used

- https://github.com/jdorn/sql-formatter
- https://github.com/jackmoore/autosize

## Donate

## License

MIT