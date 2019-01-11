/*
SVÅR - JS - Sticky thead
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
    document.querySelector('.button').addEventListener('click', (e) => {
      this.handlerClickRun();
    });
  }

  onDoubleClickCell() {
    document.querySelectorAll('.td').forEach(element => {
      element.addEventListener('dblclick', (e) => {
        if(!e.altKey) return;
        let content = e.target.innerHTML;
        document.querySelector('#modal textarea').innerHTML = content;

        modals.openModal( null, '#modal', {
          preventBGScroll: true,
          preventBGScrollHtml: true,
          preventBGScrollBody: true,
        });

        autosize.update(document.querySelector('#modal textarea'));
        console.log('open');

      });
    });
  }

  index(el) {
    return Array.from(el.parentNode.children).indexOf(el)+1;
  }

  handlerClickRun() {
    this.ajax('query');
    this.ajax('table');
  }

  ajax() {
    let sql = document.querySelector('textarea').value;
    document.querySelector('.button').dataset.loading = '';

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

      let table = document.querySelector('#table');

      if(!table) return;

      let width = table.scrollWidth;
      document.querySelector('#scrollbar').style.width = `${width}px`;
      let scroll = new Scrollmirror();
      scroll.init();

      this.onDoubleClickCell();
      delete document.querySelector('.button').dataset.loading;
    });
  }
}