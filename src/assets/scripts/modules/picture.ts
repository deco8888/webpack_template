import { debounce } from '../utils/debounce';

interface PictureOptions {
    /**
     * target selector
     */
    selectors: string[];
}

export class Picture {
    params: PictureOptions;
    img: HTMLElement;
    picture: HTMLElement;
    addClass: string;

    constructor(props: PictureOptions) {
        this.params = props;
        this.img = null;
        this.picture = null;
        this.addClass = 'is-active';
        this.init();
    }
    init(): void {
        this.params.selectors.forEach((target: string) => {
            this.img = document.querySelector(`${target} img`);
            this.picture = document.querySelector(`${target} picture`);
            if (this.img && this.picture) {
                this.handleEvent();
            }
            document.addEventListener(
                'resize',
                debounce(() => this.handleEvent.bind(this), 100),
                false
            );
        });
    }
    handleEvent(): void {
        this.picture.style.width = this.img.clientWidth + 'px';
    }
}
