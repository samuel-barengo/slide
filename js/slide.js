export default class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
    }

    onStart(event) {
        event.preventDefault();
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    onMove(event) {
    }

    onEnd(event) {
        this.wrapper.removeEventListener('mousemove', this.onMove);
    }

    addEventSlide() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper. addEventListener('mouseup', this.onEnd);
    }

    bindEvent() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvent()
        this.addEventSlide();
        return this;
    }
}