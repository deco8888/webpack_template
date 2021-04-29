import { Swiper, SwiperOptions, Pagination, Navigation, Scrollbar } from 'swiper';
import { debounce } from '../utils/debounce';

interface SliderOptions {
    board: string;
    room: string;
    boardSlider: string;
    roomSlider: string;
}

const defaults: SliderOptions = {
    board: '[data-slider="board"]',
    room: '[data-slider="room"]',
    boardSlider: '.board__slider',
    roomSlider: '.rooms__slider',
};

export class Slider {
    params: SliderOptions;
    elms: {
        board: HTMLElement;
        room: HTMLElement;
        boardSlider: HTMLElement;
        roomSlider: HTMLElement;
    };
    roomSwiperOptions: SwiperOptions;
    boardSwiperOptions: SwiperOptions;

    constructor(props: Partial<SliderOptions>) {
        this.params = { ...defaults, ...props };
        this.elms = {
            board: document.querySelector(this.params.board),
            room: document.querySelector(this.params.room),
            boardSlider: document.querySelector(this.params.boardSlider),
            roomSlider: document.querySelector(this.params.roomSlider),
        };
        this.boardSwiperOptions = {
            autoHeight: true,
            grabCursor: true,
            slidesPerView: 1,
            spaceBetween: 5,
            speed: 800,
            scrollbar: {
                el: '.board__slide-scrollbar',
                draggable: true,
                dragClass: 'board__scrollbar-drag',
                dragSize: 30,
            },
            navigation: {
                prevEl: '.board__arrow--prev',
                nextEl: '.board__arrow--next',
            },
            breakpoints: {
                1024: {
                    slidesPerView: 3,
                    scrollbar: {
                        dragSize: 40,
                    },
                },
                769: {
                    slidesPerView: 3,
                    scrollbar: {
                        dragSize: 30,
                    },
                },
                414: {
                    slidesPerView: 1,
                    scrollbar: {
                        dragSize: 40,
                    },
                },
            },
        };
        this.roomSwiperOptions = {
            autoHeight: true,
            grabCursor: true,
            slidesPerView: 1,
            spaceBetween: 5,
            speed: 800,
            navigation: {
                prevEl: '.rooms__arrow--prev',
                nextEl: '.rooms__arrow--next',
            },
            pagination: {
                el: '.rooms__slider-pagination',
                clickable: true,
                type: 'bullets',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                },
            },
        };
        this.init();
    }
    init(): void {
        this.setBoardSlider();
        this.setRoomSlider();
        window.addEventListener(
            'resize',
            debounce(() => {
                this.handleResize();
            }, 100),
            false
        );
    }
    setBoardSlider(): void {
        if (768 < window.innerWidth) {
            var sliderWidth = this.elms.board.clientWidth;
            this.elms.boardSlider.style.width = sliderWidth + 'px';
        } else {
            var sliderWidth = this.elms.board.clientWidth;
            this.elms.boardSlider.style.width = sliderWidth + 'px';
        }
        Swiper.use([Scrollbar, Navigation]);
        new Swiper(this.params.board, this.boardSwiperOptions);
    }
    setRoomSlider(): void {
        // var sliderWidth = this.elms.room.clientWidth;
        // this.elms.roomSlider.style.width = sliderWidth + 'px';
        Swiper.use([Scrollbar, Navigation, Pagination]);
        new Swiper(this.params.room, this.roomSwiperOptions);
    }
    handleResize(): void {
        this.elms.boardSlider.style.width = '100%';
        // this.elms.roomSlider.style.width = '100%';
    }
}
