/**
 * Audio player that can play one audio file at once.
 */
export class BlockingSound {
    private audioElement: HTMLAudioElement
    private audioStartPromise: Promise<void> = Promise.resolve()
    private audioFinishPromise: Promise<void> = Promise.resolve()

    public constructor() {
        this.audioElement = new Audio()

        //this.audioElement.volume = 0.5 // debug
        this.audioElement.volume = 1
    }

    /**
     * Plays a given audio and returns a promise of its playback's finish.
     */
    public start(url: string): Promise<void> {
        this.audioElement.pause()

        this.audioStartPromise = new Promise<void>((resolve) => {
            this.audioElement.addEventListener(
                'canplaythrough',
                () => {
                    this.audioElement.play()
                    resolve()
                },
                { once: true },
            )
        })

        this.audioFinishPromise = new Promise<void>((resolve) => {
            this.audioElement.addEventListener(
                'pause',
                () => {
                    resolve()
                },
                { once: true },
            )
        })

        this.audioElement.src = url

        return this.audioStartPromise
    }

    /**
     * Waits for an audio playback to finish.
     */
    public finishPlaying(): Promise<void> {
        return this.audioFinishPromise
    }

    /**
     * Immediately stops an audio playback.
     */
    public async stop(): Promise<void> {
        this.audioElement.pause()
    }
}
