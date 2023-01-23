import {BlockingSound} from './BlockingSound'

export function getActions(blockingSound: BlockingSound) {
    return {
        playWholeAudio: (audioUrl: string) => ((): Promise<void> => {
            // intentionally no await - no need to wait for it because `finishPlaying()` is guaranteed to finish later
            blockingSound.start(audioUrl)

            return blockingSound.finishPlaying()
        }),

        startPlayingAudio: (audioUrl: string) => ((): Promise<void> => {
            return blockingSound.start(audioUrl)
        }),

        stopPlayingAudio: () => ((): Promise<void> => {
            return blockingSound.stop()
        }),

        waitForAudioFinish: () => ((): Promise<void> => {
            return blockingSound.finishPlaying()
        }),
    }
}
