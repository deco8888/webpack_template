import '../../styles/pages/common.scss';
import '../modules/polyfill';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import cssVars from 'css-vars-ponyfill';
import SmoothScroll from 'smooth-scroll';
import { debounce } from '../utils/debounce';
export default class Common {
    winWidth: number;
    constructor() {
        // 変数(カスタムプロパティ)をIEにも対応させる
        cssVars();
        // DOMツリーの構築が完了した時点で発火
        this.winWidth = window.innerWidth;
        window.addEventListener('DOMContentLoaded', (): void => {
            this.smoothScroll();
        });
        // スタイルや画像、その他リソースを含めページ全体が読み込まれた時点で発火
        window.addEventListener('load', (): void => {
            this.init();
        });
        // リサイズした際
        window.addEventListener(
            'resize',
            debounce(() => {
                this.handleResize;
            }, 100),
            false
        );
    }
    init() {}
    smoothScroll(): void {
        new SmoothScroll('a[href*="#"]', {
            speed: 500,
            offset: 100,
            easing: 'easeInOutCubic',
            updateURL: false,
        });
    }
    handleResize(): void {
        if (this.winWidth != window.innerWidth) {
            this.winWidth = window.innerWidth;
        }
    }
}
new Common();
