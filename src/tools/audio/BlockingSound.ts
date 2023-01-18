export class BlockingSound {

    private audioElement: HTMLAudioElement
    private audioStartPromise: Promise<void> = Promise.resolve()
    private audioFinishPromise: Promise<void> = Promise.resolve()

    public constructor() {
        this.audioElement = new Audio()

        //this.audioElement.volume = 0.5 // debug
        this.audioElement.volume = 1
    }

    public start(url: string): Promise<void> {
        this.audioElement.pause()

        this.audioStartPromise = new Promise<void>((resolve) => {
            this.audioElement.addEventListener("canplaythrough", event => {
                this.audioElement.play()
                resolve()
            }, {once: true})
        })

        this.audioFinishPromise = new Promise<void>((resolve) => {
            this.audioElement.addEventListener('pause', event => {
                resolve()
            }, {once: true})
        })

        this.audioElement.src = url

        return this.audioStartPromise
    }

    public finishPlaying(): Promise<void> {
        return this.audioFinishPromise
    }

    public async stop(): Promise<void> {
        this.audioElement.pause()
    }
}
