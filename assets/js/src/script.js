/*
SVÅR - JS - Sticky thead
*/

class MySqlQueryTester {
  constructor(options) {
    this.o = Object.assign({}, this.defaults(), options);

    document.addEventListener("DOMContentLoaded", () => {
      this.onClickRun();
      this.onEnter();
      this.onTheadScroll();
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

  onEnter() {
    document.querySelector('.button').addEventListener('keyup', (e) => {
      if(e.code == 'Enter') {
        this.handlerClickRun();
      }
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

      this.thead();
    });
  }

  thead() {
    let width = document.querySelector('table').scrollWidth;

    document.querySelector('#thead').style.width = width + 'px';

    let i = 1;
    document.querySelectorAll('th').forEach(th => {
      let th_size = th.offsetWidth;
      document.querySelector(`#thead .th:nth-child(${i})`).style.width = th_size + 'px';
      i++;
    });
  }

  onTheadScroll() {
    window.addEventListener('scroll', function(e) {
      let table = document.querySelector('#table');
      let table_rect = table.getBoundingClientRect();
      if(table_rect.top > 0) {
        delete document.querySelector('#thead-wrap').dataset.fixed;
      } else {
        document.querySelector('#thead-wrap').dataset.fixed = '';
      }
    });
  }
}