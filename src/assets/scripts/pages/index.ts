import '../../styles/pages/index.scss';
import { Loading } from '../modules/loading';
import { Slider } from '../modules/slider';
import { Scroll } from '../modules/scroll';
import { VerticalScroll } from '../modules/vertical';
export default class Index {
    constructor() {
        window.addEventListener('DOMContentLoaded', () => {
            this.loading();
        });
        window.addEventListener('load', (): void => {
            setTimeout(() => {
                // new Slider({});
            }, 100);
        });
        this.init();
    }
    init(): void {
        const ua = window.navigator.userAgent.toUpperCase();
        if (ua.indexOf('MSIE') === -1 && ua.indexOf('TRIDENT') === -1) {
            new Scroll({
                selectors: '[data-role="scroll"]',
            });
        } else {
            // IE対応
            new VerticalScroll({
                selectors: '[data-role="scroll"]',
            });
        }
    }
    loading(): void {
        // セッションが続いている場合、ローディングを挟まない
        if (sessionStorage.getItem('access')) {
            document.querySelector<HTMLElement>('[data-role="mv"]').classList.add('is-active');
            document.querySelectorAll<HTMLElement>('[data-role="wrap"]').forEach((target: HTMLElement) => {
                target.classList.add('is-active');
            });
        } else {
            document.querySelector<HTMLElement>('[data-role="loading"]').classList.remove('is-hidden');
            new Loading({});
            sessionStorage.setItem('access', '0');
        }
    }
}
new Index();
