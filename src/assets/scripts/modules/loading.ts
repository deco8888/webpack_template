import { gsap } from 'gsap';
const imagesLoaded = require('imagesloaded');

interface LoadingOptions {
    loading: string;
    loadingCount: string;
    loadingSwitch: string;
    mv: string;
    wrap: string;
}

const defaults: LoadingOptions = {
    loading: '[data-role="loading"]',
    loadingCount: '[data-role="loading-count"]',
    loadingSwitch: '[data-role="loading-switch"]',
    mv: '[data-role="mv"]',
    wrap: '[data-role="wrap"]',
};

export class Loading {
    prams: LoadingOptions;
    elms: {
        loading: HTMLElement;
        loadingCount: HTMLElement;
        body: HTMLElement;
        mv: HTMLElement;
        wrapList: NodeListOf<HTMLElement>;
    };
    loadingSwitch: string;
    isComplete: boolean;
    loads: {
        imgLoad: any;
        imgTotal: number;
        imgLoaded: number;
        progressSpeed: number;
        progressCount: number;
        progressResult: number;
        progressInit: any;
    };
    addClassActive: string;
    addClassHidden: string;
    constructor(props: Partial<LoadingOptions>) {
        this.prams = { ...defaults, ...props };
        this.elms = {
            loading: document.querySelector(this.prams.loading),
            loadingCount: document.querySelector(this.prams.loadingCount),
            body: document.querySelector('body'),
            mv: document.querySelector(this.prams.mv),
            wrapList: document.querySelectorAll(this.prams.wrap),
        };
        this.loadingSwitch = this.prams.loadingSwitch;
        this.isComplete = false;
        this.loads = {
            imgLoad: null,
            imgTotal: 0,
            imgLoaded: 0,
            progressSpeed: 1,
            progressCount: 0,
            progressResult: 0,
            progressInit: null,
        };
        this.addClassActive = 'is-active';
        this.addClassHidden = 'is-hidden';
        this.init();
        this.switch();
    }
    init(): void {
        var self = this;
        this.elms.body.classList.add(this.addClassHidden);
        this.loads.imgLoad = imagesLoaded(this.elms.body);
        this.loads.imgTotal = this.loads.imgLoad.images.length;
        this.loads.progressInit = setInterval(() => {
            self.updateProgress();
        }, 25);
        this.loads.imgLoad.on('progress', () => {
            self.loads.imgLoaded++;
        });
    }
    updateProgress(): void {
        this.loads.progressCount += (this.loads.imgLoaded / this.loads.imgTotal) * this.loads.progressSpeed;
        if (this.loads.progressCount >= 100 && this.loads.imgTotal > this.loads.imgLoaded) {
            this.loads.progressResult = 99;
        } else if (this.loads.progressCount > 99.9) {
            this.loads.progressResult = 100;
        } else {
            this.loads.progressResult = this.loads.progressCount;
        }
        var count = Math.floor(this.loads.progressResult);
        this.elms.loadingCount.innerHTML = String(count);
        if (this.loads.progressResult >= 100 && this.loads.imgTotal === this.loads.imgLoaded && this.isComplete) {
            clearInterval(this.loads.progressInit);
            this.start();
        }
    }
    switch(): void {
        var self = this;
        const switcTl = gsap.timeline({
            paused: false,
        });
        switcTl.to(this.loadingSwitch, {
            duration: 1.5,
            opacity: 1,
            stagger: {
                each: 1.5,
            },
            onCompleteAll: (): void => {
                self.isComplete = true;
            },
        });
        switcTl.play();
    }
    start(): Promise<any> {
        var self = this;
        return new Promise((resolve: any) => {
            const startTl = gsap.timeline({
                paused: false,
            });
            startTl.to(self.elms.loading, {
                delay: 1,
                duration: 1,
                opacity: 0,
                onComplete: (): void => {
                    self.elms.mv.classList.add(self.addClassActive);
                    self.elms.wrapList.forEach((target: HTMLElement) => {
                        target.classList.add(self.addClassActive);
                    });
                    self.elms.body.classList.remove(self.addClassHidden);
                    self.elms.loading.classList.add(self.addClassHidden);
                    setTimeout(() => {
                        self.elms.loading.style.display = 'none';
                    }, 500);
                    resolve();
                },
            });
            startTl.play();
        });
    }
}
