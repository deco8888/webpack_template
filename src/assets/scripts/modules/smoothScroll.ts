import 'scroll-behavior-polyfill';
import { debounce } from '../utils/debounce';
import { isMobile } from './isMobile';

interface SmoothScrollOptions {
    /**
     * target selector
     */
    anchorSelector: string;
    headerSelector: string;
}

const defaults: SmoothScrollOptions = {
    anchorSelector: '[data-anchor]',
    headerSelector: '[data-global-header]',
};

export class SmoothScroll {
    params: SmoothScrollOptions;
    elms: {
        targets: NodeListOf<HTMLElement>;
        header: HTMLElement;
    };
    headerHeight: number;
    threshold: number;
    isMobile: boolean;
    constructor(props: Partial<SmoothScrollOptions> = {}) {
        this.params = { ...defaults, ...props };
        this.elms = {
            targets: document.querySelectorAll(this.params.anchorSelector),
            header: null,
        };
        this.headerHeight = 0;
        this.threshold = this.isMobile ? 50 : 100;
        this.isMobile = isMobile();
        if (this.elms.targets.length > 0) this.init();
    }
    init(): void {
        this.handleResize();
        this.elms.targets.forEach((target) => {
            target.addEventListener('click', (): void => {
                const href = target.getAttribute('href');
                const selector = href.substring(href.indexOf('#'), href.length);
                this.setSmoothScroll(selector);
            });
        });
        window.addEventListener(
            'resize',
            debounce(() => this.handleResize(), 100),
            false
        );
    }
    setSmoothScroll(selector: string): void {
        const target = document.querySelector<HTMLElement>(selector);
        const targetTop = target.getBoundingClientRect().top;
        const offsetTop = window.pageYOffset;
        target.style.scrollMarginTop = `${this.headerHeight}px`;
        window.scrollTo({
            top: targetTop + offsetTop - this.threshold,
            behavior: 'smooth',
        });
    }
    handleResize(): void {
        const gHeader = document.querySelector(this.params.headerSelector).clientHeight * 2;
        const header = document.querySelector('header').clientHeight;
        this.headerHeight = gHeader + header;
    }
}
