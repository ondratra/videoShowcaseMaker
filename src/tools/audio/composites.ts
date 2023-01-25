import { IPluginAppliance } from '../plugin'
import { BlockingSound } from './BlockingSound'

/**
 * Default values for Audio plugin composites.
 */
export interface IAudioPluginDefaults {}

/**
 * Audio plugin's composites.
 */
export const composites =
    (blockingSound: BlockingSound) =>
    (_pluginsLoaded: Record<string, IPluginAppliance<unknown>>, _defaults: IAudioPluginDefaults) => ({
        /**
         * Plays a given audio and waits for the playback to finish.
         */
        playWholeAudio: (audioUrl: string) => (): Promise<void> => {
            // intentionally no await - no need to wait for it because `finishPlaying()` is guaranteed to finish later
            blockingSound.start(audioUrl)

            return blockingSound.finishPlaying()
        },
    })
