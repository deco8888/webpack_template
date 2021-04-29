interface FirstAnimOptions {
    /**
     * target selector
     */
    selectors: string;
}

const defaults: FirstAnimOptions = {
    selectors: '[data-anim="first"]',
};

export class FirstAnim {
    params: FirstAnimOptions;
    targets: NodeListOf<HTMLElement>;
    addClass: string;

    constructor(props: Partial<FirstAnimOptions>) {
        this.params = { ...defaults, ...props };
        this.targets = null;
        this.addClass = 'is-active';
        this.init();
    }
    init(): void {
        this.targets = document.querySelectorAll(this.params.selectors);
        if (this.targets.length > 0) {
            this.setAnim();
        }
    }
    setAnim(): void {
        this.targets.forEach((target: HTMLElement) => {
            target.classList.add(this.addClass);
        });
    }
}
