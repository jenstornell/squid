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
      let table = document.querySelector('#table');

      if(!table) return;
      table.scrollLeft = scrollLeft;

      let thead = document.querySelector('#thead');
      thead.style.marginLeft = -scrollLeft + 'px';

      console.log(scrollLeft);
    });
  }

  runOnScroll() {

  }
}