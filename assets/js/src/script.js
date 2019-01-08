/*
MESSAGE - Message load spinner
JS - Sticky thead
ERROR - CSS missing

DOCS
Setup
Donate
Screenshot
*/

class MySqlQueryTester {
  constructor(options) {
    this.o = Object.assign({}, this.defaults(), options);

    document.addEventListener("DOMContentLoaded", () => {
      this.onClickRun();
    });
  }

  defaults() {
    return {
      root: 'http://localhost/misc/mysql-query-tester/'
    };
  }

  onClickRun() {
    document.querySelector('button').addEventListener('click', (e) => {
      this.handlerClickRun();
    });
  }

  handlerClickRun() {
    this.ajax('query');
    this.ajax('table');
  }

  ajax() {
    let sql = document.querySelector('textarea').value;

    fetch(this.o.root + '/core/ajax-table.php', {
      method: 'POST',
      body: sql,
      headers: {
        "Content-Type": "Content-Type: application/json"
    },
    }).then((response) => {
      return response.text();
    })
    .then((text) => {
      document.querySelector('#results').innerHTML = text;
      let width = document.querySelector('#table').scrollWidth;
      document.querySelector('#scrollbar').style.width = `${width}px`;
      let scroll = new Scrollmirror();
      scroll.init();
    });
  }
}