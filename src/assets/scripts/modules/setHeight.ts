interface SetHightOptions {
    /**
     * target selector
     */
    selectors: string[];
}

const defaults: SetHightOptions = {
    selectors: [],
};

export class SetHight {
    params: SetHightOptions;
    targets: NodeListOf<HTMLElement>;
    addClass: string;

    constructor(props: Partial<SetHightOptions>) {
        this.params = { ...defaults, ...props };
        this.targets = null;
        this.addClass = 'is-active';
        this.init();
    }
    init(): void {
        this.params.selectors.forEach((target: string) => {
            this.targets = document.querySelectorAll(target);
            if (this.targets.length > 0) {
                this.handleEvent();
            }
        });
    }
    handleEvent(): void {
        this.targets.forEach((target: HTMLElement) => {
            target.style.minHeight = 0 + '%';
        });
    }
}
