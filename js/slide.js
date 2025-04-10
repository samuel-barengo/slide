export default class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 }
    }
    // método para mexer o slide
    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1;
        return this.dist.finalPosition - this.dist.movement;
    }

    onStart(event) {
        let movetype;

        if (event.type === 'mousedown') {
            event.preventDefault();
            this.dist.startX = event.clientX;
            movetype = 'mousemove';

        } else {
            this.dist.startX = event.changedTouches[0].clientX;
            movetype = 'touchmove';
        }
        // o evento mousemove so irá ser executado após dar onStart
        this.wrapper.addEventListener(movetype, this.onMove);
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
    }

    // Método para adicionar Eventos
    addSlideEvent() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    bindEvent() { // Todo evento dentro de classe precisa ter o bind
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvent();
        this.addSlideEvent();
        return this
    }
}

// As propriedades clientX e clientY em JavaScript
// retornam as coordenadas do mouse em relação à janela visível do navegador (viewport), sem contar rolagens da página.