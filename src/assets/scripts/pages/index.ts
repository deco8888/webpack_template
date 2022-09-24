import '../../styles/pages/index.scss';
import { Start } from '../modules/start';
import { isMobile } from '../modules/isMobile';
import { SmoothScroll } from '../modules/smoothScroll';
import { Scroll } from '../modules/scroll';
import { Parallax } from '../modules/parallax';
import { addClass } from '../utils/classList';
import { hasClass } from '../utils/hasClass';
import loaded from 'imagesloaded';
import { throttle } from '../utils/throttle';

export default class Index {
    isMobile: boolean;
    constructor() {
        this.isMobile = isMobile();
        // スタイルや画像、その他リソースを含めページ全体が読み込まれた時点で発火
        window.addEventListener(
            'load',
            (): void => {
                this.init();
            },
            false
        );
    }
    init(): void {
        loaded(
            document.body,
            {
                background: true,
            },
            (): void => {
                void (async (): Promise<void> => {
                    await new Start().init();
                    new Scroll();
                    new SmoothScroll();
                    new Parallax();
                    this.handleScroll();
                });
            }
        );
    }
    handleScroll(): void {
        window.addEventListener(
            'scroll',
            throttle(() => {
                this.checkFirstVisibleRange();
            }, 30),
            {
                capture: false,
                passive: true,
            }
        );
    }
    checkFirstVisibleRange(): void {
        const firstEl = document.querySelector('[data-first]') as HTMLElement;
        const rectTop = firstEl.getBoundingClientRect().top;
        const winTop = window.scrollY + rectTop;
        const rootMarginBottom = window.innerHeight * 0.75;
        if (winTop < rootMarginBottom) {
            if (rectTop < winTop) addClass(firstEl, hasClass.active);
        } else {
            addClass(firstEl, hasClass.active);
        }
    }
}
new Index();
