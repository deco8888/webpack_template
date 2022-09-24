import gsap, { Power2 } from 'gsap';
import { hasClass } from '../utils/hasClass';
import { addClass } from '../utils/classList';
import { SmoothScroll } from './smoothScroll';

interface StartOptions {
    wrapperSelector: string;
    headerSelector: string;
    mvSelector: string;
}

const defaults: StartOptions = {
    wrapperSelector: '[data-wrapper]',
    headerSelector: '[l-header]',
    mvSelector: '[data-mv]',
};

export class Start {
    params: StartOptions;
    elms: {
        wrapper: HTMLElement;
        header: HTMLElement;
        mv: HTMLElement;
    };
    constructor(props: Partial<StartOptions> = {}) {
        this.params = { ...defaults, ...props };
        this.elms = {
            wrapper: document.querySelector(this.params.wrapperSelector),
            header: document.querySelector(this.params.headerSelector),
            mv: document.querySelector(this.params.mvSelector),
        };
    }
    async init(): Promise<void> {
        const tl = gsap.timeline({
            paused: true,
            ease: Power2.easeOut,
            onStart: () => {
                this.elms.wrapper.style.display = 'block';
            },
        });
        // mvを表示
        tl.to(
            this.elms.mv,
            {
                duration: 0.8,
                opacity: 1,
                onComplete: () => {
                    addClass(this.elms.mv, hasClass.active);
                    const smoothScroll = new SmoothScroll();
                    const hash = location.hash;
                    if (hash) smoothScroll.setSmoothScroll(hash);
                },
            },
            0
        );
        await tl.play();
    }
}
