'use strict';

class Cards {
  constructor(){
    this.cards = document.querySelectorAll('.card');
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.update = this.update.bind(this);
    this.target = null;
    this.targetBCR = null;
    this.startX = 0;
    this.currentX = 0;
    this.screenX = 0;
    this.targetX = 0;
    this.draggingCard = false;

    this.addEventListeners();

    requestAnimationFrame(this.update)
  }

  addEventListeners(){
    document.addEventListener('touchstart', this.onStart);
    document.addEventListener('touchmove', this.onMove);
    document.addEventListener('touchend', this.onEnd);
  }

  onStart(e){

    if (this.target) {
      return;
    }

    if (!e.target.classList.contains('card')) {
      return;
    }

    this.target = e.target;
    this.targetBCR = this.target.getBoundingClientRect();
    this.startX = e.pageX || e.touches[0].pageX;
    this.currentX = this.startX;
    this.draggingCard = true;
    this.target.style.willChange = 'transform';

    e.preventDefault();
  }

  onMove(e){
    if (!this.target) {
      return;
    }
    this.currentX = e.pageX || e.touches[0].pageX;
  }

  onEnd(e){
    if (!this.target) {
      return;
    }

    this.targetX = 0;

    let screenX = this.currentX - this.startX;

    if (Math.abs(screenX) > this.targetBCR.width * 0.35) {
      this.targetX = (screenX > 0) ? this.targetBCR.width : -this.targetBCR.width;
    }

    this.draggingCard = false;

  }

  update(){

    requestAnimationFrame(this.update);

    if (!this.target) {
      return;
    }

    if (this.draggingCard) {
      this.screenX = this.currentX - this.startX;
    } else {
      this.screenX += (this.targetX - this.screenX) / 4;
    }

    const normalizedDragDistance = (Math.abs(this.screenX) / this.targetBCR.width);
    const opacity = 1 - Math.pow(normalizedDragDistance, 3);

    this.target.style.transform = `translateX(${this.screenX}px)`;
    this.target.style.opacity = opacity;

    const isNearlyInvisible = (opacity < 0.01)

    if (!this.draggingCard ) {
      if (isNearlyInvisible) {
        this.target.parentNode.removeChild(this.target);
        this.target = null;
      }
    }
  }

}

window.addEventListener('load', () => {
  new Cards();
});
