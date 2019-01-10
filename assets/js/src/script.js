/*
MESSAGE - Message load spinner - Byt ukonen i play rotera
Hover field type
Cell Height ska också påverkas vid dubbelklick eller MODAL

SVÅR - JS - Sticky thead
SCREENCAST
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

  onDoubleClickCell() {
    document.querySelectorAll('td').forEach(element => {
      element.addEventListener('dblclick', (e) => {
        let index = this.index(e.target.closest('td'));
        let th = document.querySelector(`th:nth-child(${index})`);
        let style = '';

        if(typeof th.dataset.open === 'undefined') {
          th.dataset.open = '';
        } else {
          delete th.dataset.open;
        }

        document.querySelectorAll('th[data-open]').forEach(el_th => {
          let index_th = this.index(el_th);
          style += `td:nth-child(${index_th}),\n`;
        });

        if(style == '') {
          document.querySelector('#custom-css').innerHTML = '';
        } else {
          style = style.substring(0, style.length - 2) + `{
            max-width: none !important;
          }`;
          document.querySelector('#custom-css').innerHTML = style;
        }

        let table = document.querySelector('#table');
        let width = table.scrollWidth;
        document.querySelector('#scrollbar').style.width = `${width}px`;
        let scroll = new Scrollmirror();
        scroll.init();
      });
    });
    //custom-css
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
    });
  }
}