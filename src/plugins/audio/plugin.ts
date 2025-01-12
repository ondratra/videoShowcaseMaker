// NOTE: currently only supports 1 audio playing at time
//       if you need to play multiple audio files at once create new plugin by overloading
//       this one and add it into plugin list
//       e.g. {...audioPlugin.setupPlugin(), name: 'audio_2' as const}
// TODO: this has to be addressed somehow pragmatically to allow for example playing of subtitled audio
//       and cursor click at same time
//       !!! maybe this can/should be handled in generally for all plugins - what if you want 2 cursors at once? !!!

import { emptyPlugin, IPluginAppliance } from '../../tools/plugin'
import { BlockingSound } from './BlockingSound'
import { composites, IAudioPluginDefaults } from './composites'
import { primitives } from './primitives'

/**
 * Recommended/example values for default values for Core plugin.
 */
export const recommendedDefaults: IAudioPluginDefaults = {} satisfies Partial<IAudioPluginDefaults>

/**
 * Audio plugin creates an HTML audio player and exposes basic manipulation actions for it.
 */
export const setupPlugin = () => async () => {
    const blockingSound = new BlockingSound()

    return {
        ...emptyPlugin,

        name: 'audio',
        primitives: primitives(blockingSound),
        composites: composites(blockingSound),
    } as const satisfies IPluginAppliance<IAudioPluginDefaults>
}
