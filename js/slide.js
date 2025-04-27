import debounce from './debounce.js';

export class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 }
        this.activeClass = 'active';
        this.changeEvent = new Event('changeEvent');
    }

    transition(active) {
        this.slide.style.transition = active ? 'transform .3s' : '';
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
        this.transition(false);
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
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if (this.dist.movement > 120 && this.index.next != undefined) {
            this.activeNextSlide();
        } else if (this.dist.movement < -120 && this.index.prev != undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlide(this.index.active);
        }
    }

    // Método para adicionar Eventos
    addSlideEvent() {
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    // Slides config
    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return - (slide.offsetLeft - margin);
    }

    slideConfig() {
        this.slideArray = [...this.slide.children].map((element) => {
            const position = this.slidePosition(element);
            return { position, element }
        });
    }

    slideIndexNav(index) {
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        }
    }

    // Metodo que muda o slide de acordo o index que passar nele
    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slideIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
        this.changeActiveClass();
        this.wrapper.dispatchEvent(this.changeEvent);
    }

    changeActiveClass() {
        this.slideArray.forEach(item => item.element.classList.remove(this.activeClass));
        this.slideArray[this.index.active].element.classList.add(this.activeClass);
    }

    activePrevSlide() {
        if (this.index.prev !== undefined) {
            this.changeSlide(this.index.prev);
        }
    }
    activeNextSlide() {
        if (this.index.next !== undefined) this.changeSlide(this.index.next);
    }

    onResize() {
        setTimeout(() => {
            this.slideConfig();
            this.changeSlide(this.index.active);
        }, 1000);
    }

    addResizeEvent() {
        window.addEventListener('resize', this.onResize);
    }

    bindEvent() { // Todo evento dentro de classe precisa ter o bind
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.activePrevSlide = this.activePrevSlide.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);

        this.onResize = debounce(this.onResize.bind(this), 200);
    }

    init() {
        this.bindEvent();
        this.transition(true);
        this.addSlideEvent();
        this.slideConfig();
        this.addResizeEvent();
        this.changeSlide(0)
        return this;
    }
}

export default class SlideNav extends Slide {
    constructor(slide, wrapper) {
        super(slide, wrapper)
        this.bindControlEvents();
    }
    addArrow(prev, next) {
        this.prevElement = document.querySelector(prev);
        this.nextElement = document.querySelector(next);
        this.addArrowEvent();
    }

    addArrowEvent() {
        this.prevElement.addEventListener('click', this.activePrevSlide);
        this.nextElement.addEventListener('click', this.activeNextSlide);
    }

    createControl() {
        const control = document.createElement('ul');
        control.dataset.control = 'slide';
        this.slideArray.forEach((item, index) => {
            control.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`;
        });
        this.wrapper.appendChild(control);
        return control;
    }

    eventControl(item, index) {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            this.changeSlide(index);
        });
        this.wrapper.addEventListener('changeEvent', this.activeControlItem);
    }

    activeControlItem() {
        this.controlArray.forEach(item => item.classList.remove(this.activeClass));
        this.controlArray[this.index.active].classList.add(this.activeClass);
    }

    addControl(customControl) {
        this.control = document.querySelector(customControl) || this.createControl();
        this.controlArray = [...this.control.children];
        this.activeControlItem()
        this.controlArray.forEach(this.eventControl);
        // this.controlArray.forEach((item, index) => {
        //     this.eventControl(item, index);
        // })
    }

    bindControlEvents() {
        this.eventControl = this.eventControl.bind(this);
        this.activeControlItem = this.activeControlItem.bind(this);
    }
}

// As propriedades clientX e clientY em JavaScript
// retornam as coordenadas do mouse em relação à janela visível do navegador (viewport), sem contar rolagens da página.