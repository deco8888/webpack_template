import { throttle } from '../utils/throttle';

interface VerticalScrollOptions {
    /**
     * target selector
     */
    selectors: string;
}

const defaults: VerticalScrollOptions = {
    selectors: '[data-role="scroll"]',
};

export class VerticalScroll {
    params: VerticalScrollOptions;
    targets: NodeListOf<HTMLElement>;
    addClass: string;
    scrollValue: number;
    windowHeight: number;
    value: number;
    scrollTop: number;

    constructor(props: Partial<VerticalScrollOptions>) {
        this.params = { ...defaults, ...props };
        this.targets = null;
        this.addClass = 'is-active';
        this.scrollValue = 0;
        this.windowHeight = 0;
        this.value = 0;
        this.scrollTop = 0;
        this.init();
    }
    init(): void {
        this.targets = document.querySelectorAll(this.params.selectors);
        if (this.targets.length > 0) {
            this.setScrollAnim();
        }
    }
    setScrollAnim(): void {
        window.addEventListener(
            'scroll',
            throttle(() => {
                this.scrollValue = window.pageYOffset;
                this.windowHeight = window.innerHeight;
                this.value = 100;

                this.targets.forEach((target: HTMLElement) => {
                    this.scrollTop = target.getBoundingClientRect().top + this.scrollValue;
                    if (this.scrollValue > this.scrollTop - this.windowHeight + this.value) {
                        target.classList.add(this.addClass);
                    }
                });
            }, 100)
        );
    }
}
