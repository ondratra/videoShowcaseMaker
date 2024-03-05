import { BlockingSound } from './BlockingSound'

/**
 * Audio plugin's primitives.
 */
export function primitives(blockingSound: BlockingSound) {
    return {
        /**
         * Starts playing a given audio. Doesn't wait for it to finish. Effectively forks the execution flow.
         */
        startPlayingAudio: (audioUrl: string) => (): Promise<void> => {
            return blockingSound.start(audioUrl)
        },

        /**
         * Immediately stops an audio playback.
         */
        stopPlayingAudio: () => (): Promise<void> => {
            return blockingSound.stop()
        },

        /**
         * Waits for an audio playback to finish.
         */
        waitForAudioFinish: () => (): Promise<void> => {
            return blockingSound.finishPlaying()
        },
    }
}
