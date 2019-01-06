/*
Message load spinner
Vid fel visa felmeddelande i röd ruta istället för table
Textarea autosize
Textarea options (spellcheck osv)
Spara senaste frågan på disk
Om fråga på disk finns, ladda den med PHP vid start, men ladda inte tabell
Favicon - feather database
Floatable scrollbar
Max cell width option
Fixed headers sticky
Toggle query - Löser floatable scrollbar
Topmenu
Topmenu logo
Topmenu query
Topmenu results
Topmeny vanliga sql satser
Färgad fråga
Squid runner
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
    this.ajax();
  }

  ajax() {
    let sql = document.querySelector('textarea').value;

    fetch(this.o.root + 'ajax.php', {
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
      let width = document.querySelector('#results').scrollWidth;

      document.querySelector('#scrollbar').style.width = `${width}px`;
      //console.log(width);

      //syncscroll.reset();

      let scroll = new Scrollmirror();
      scroll.init();
      /*message.set(text);

      if(!helpers.isJson(text)) return;

      let result = JSON.parse(text);

      if(!result.success) return;

      delete td.dataset.loading;
      this.resetOriginal(result.original, el);
      this.unsaved(el);
      */
     //console.log(text);
    });
  }
}