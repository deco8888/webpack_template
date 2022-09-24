import { lerp } from '../utils/math';
import { isMobile } from './isMobile';
import gsap from 'gsap';

interface ParallaxOptions {
    /**
     * target selector
     */
    anchorSelectors: string;
}

interface ElmInfoOptions {
    el: HTMLElement | null;
    current: number;
    previous: number;
    ease: number;
    parallax: number;
}

const defaults: ParallaxOptions = {
    anchorSelectors: '[data-parallax-obj]',
};

export class Parallax {
    params: ParallaxOptions;
    elms: {
        targets: NodeListOf<HTMLElement>;
    };
    threshold: number;
    isMobile: boolean;
    elmInfo: ElmInfoOptions;
    elmInfoList: ElmInfoOptions[];

    constructor(props: Partial<ParallaxOptions> = {}) {
        this.params = { ...defaults, ...props };
        this.elms = {
            targets: document.querySelectorAll(this.params.anchorSelectors),
        };
        this.isMobile = isMobile();
        this.threshold = this.isMobile ? 50 : 100;
        this.elmInfo = {
            el: null,
            current: 0,
            previous: 0,
            ease: 0.1,
            parallax: 1,
        };
        this.elmInfoList = [];

        if (this.elms.targets.length > 0) this.init();
    }
    init(): void {
        this.handleEvent();
    }
    handleEvent(): void {
        this.getElmInfo();
        this.transformElm();
    }
    getElmInfo(): void {
        this.elms.targets.forEach((target) => {
            this.elmInfo.el = target;
            this.elmInfoList.push(this.elmInfo);
        });
    }
    transformElm(): void {
        this.scrollY();
        if (this.elmInfoList.length > 0) {
            this.elmInfoList.forEach((elmInfo, index) => {
                elmInfo.ease = parseFloat(`0.1${index}`);
                // 開始位置（previous）と終了位置間（current）の進行状況を基に、該当要素の変更位置を計算
                elmInfo.previous = lerp(elmInfo.previous, elmInfo.current, elmInfo.ease);
                elmInfo.previous = Math.floor(elmInfo.previous * 100) / 100;
                const tl = gsap.timeline();
                if (window.scrollY > 0) {
                    tl.to(
                        elmInfo.el,
                        {
                            y: -elmInfo.previous,
                            duration: 1,
                        },
                        0
                    );
                } else {
                    tl.to(
                        elmInfo.el,
                        {
                            y: 0,
                            duration: 1,
                        },
                        0
                    );
                }
            });
        }
        requestAnimationFrame(() => this.transformElm());
    }
    scrollY(): void {
        if (this.elmInfoList.length > 0) {
            this.elmInfoList.forEach((elmInfo) => {
                if (elmInfo.el) {
                    const elmTop = elmInfo.el.getBoundingClientRect().top;
                    elmInfo.current = (window.innerHeight - elmTop) * 0.07;
                }
            });
        }
    }
}
