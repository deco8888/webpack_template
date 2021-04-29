require('intersection-observer');

interface ScrollOptions {
    /**
     * target selector
     */
    selectors: string;
}

const defaults: ScrollOptions = {
    selectors: '[data-role="scroll"]',
};

export class Scroll {
    params: ScrollOptions;
    threshold: number | number[];
    targets: NodeListOf<HTMLElement>;
    addClass: string;

    constructor(props: ScrollOptions) {
        this.params = props;
        this.threshold = [0.2];
        this.targets = null;
        this.addClass = 'is-active';
        this.init();
    }
    init(): void {
        this.targets = document.querySelectorAll(this.params.selectors);
        if (this.targets.length > 0) {
            this.setScrollAnim();
        }
    }
    setScrollAnim(): void {
        const options: IntersectionObserverInit = {
            threshold: this.threshold,
        };
        const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.intersectionRatio >= this.threshold) {
                    entry.target.classList.add(this.addClass);
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(callback, options);
        this.targets.forEach((target: HTMLElement) => {
            observer.observe(target);
        });
    }
}
