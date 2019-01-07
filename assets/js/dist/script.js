/*
MESSAGE - Message load spinner

TEXTAREA - Textarea autosize

OPTION - Option class
OPTION - Max cells width option
OPTION - Textarea options (spellcheck osv)

JS - Sticky thead

DOCS
Screenshot
*/

class MySqlQueryTester {
  constructor(options) {
    this.o = Object.assign({}, this.defaults(), options);

    console.log(this.o);

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
class Scrollmirror {
  constructor() {

  }

  init() {
    this.onScroll();
  }

  onScroll() {
    let element = document.querySelector('#scrollbar');
    element.parentNode.addEventListener('scroll', (e) => {
      let scrollLeft = e.target.scrollLeft;

      console.log(scrollLeft);

      document.querySelector('#table').scrollLeft = scrollLeft;
    });
  }

  runOnScroll() {

  }
}