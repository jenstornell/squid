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