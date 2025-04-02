export default class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 }
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }
    updatePosition(clientX) {
        (this.dist.movement = this.dist.startX - clientX) * 1.6;
        return this.dist.finalPosition - this.dist.movement;
    }
    onStart(event) {
        event.preventDefault();
        this.dist.startX = event.clientX;
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    onMove(event) {
        const finalPosition = this.updatePosition(event.clientX);
        this.moveSlide(finalPosition)
    }

    onEnd(event) {
        this.dist.finalPosition = this.dist.movePosition
        this.wrapper.removeEventListener('mousemove', this.onMove);
    }

    addEventSlide() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
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

// As propriedades clientX e clientY em JavaScript 
// retornam as coordenadas do mouse em relação à janela visível do navegador (viewport), sem contar rolagens da página.