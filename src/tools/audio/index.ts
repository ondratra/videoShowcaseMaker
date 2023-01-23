// NOTE: currently only supports 1 audio playing at time
//       if you need to play multiple audio files at once create new plugin by overloading
//       this one and add it into plugin list
//       e.g. {...audioPlugin.setupPlugin(), name: 'audio_2' as const}
// TODO: this has to be addressed somehow pragmatically to allow for example playing of subtitled audio
//       and cursor click at same time

import {IPluginAppliance, IPluginElements} from '../plugin'
import {BlockingSound} from './BlockingSound'
import {getActions} from './primitives'

export interface IDefaults {}

export const setupPlugin = () => async () => {
    const blockingSound = new BlockingSound()

    return {
        name: 'audio' as const,
        requiredPlugins: [],
        elements: {},
        primitives: getActions(blockingSound),
        composites: () => {},
        destroy: async () => {},
    } as const satisfies IPluginAppliance<IDefaults>
}
