/*
MESSAGE - Message load spinner
TEXTAREA - Textarea autosize
OPTION - Option class
OPTION - Max cells width option
OPTION - Textarea options (spellcheck osv)
CSS - Fixed headers sticky
QUERY - Toggle accordion DETAILS SUMMARY
POPUP - Topmeny vanliga sql satser
PHP - Affected rows
PHP - Found rows

DOCS
Save latest
License
Donate
Setup
Options
Requirements
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

  ajax(type) {
    let sql = document.querySelector('textarea').value;

    fetch(this.o.root + '/core/ajax-' + type + '.php', {
      method: 'POST',
      body: sql,
      headers: {
        "Content-Type": "Content-Type: application/json"
    },
    }).then((response) => {
      return response.text();
    })
    .then((text) => {
      if(type == 'table') {
        document.querySelector('#results').innerHTML = text;
        let width = document.querySelector('#results').scrollWidth;
        document.querySelector('#scrollbar').style.width = `${width}px`;
        let scroll = new Scrollmirror();
        scroll.init();
      } else if(type == 'query') {
        document.querySelector('#query').innerHTML = text;
      }
    });
  }
}