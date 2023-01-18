// NOTE: currently only supports 1 audio playing at time
//       if you need to play multiple audio files at once create new plugin by overloading
//       this one and add it into plugin list
//       e.g. {...audioPlugin.setupAll(), name: 'audio_2' as const}
// TODO: this has to be addressed somehow pragmatically to allow for example playing of subtitled audio
//       and cursor click at same time

import {IPluginAppliance, IPluginElements} from '../plugin'
import {BlockingSound} from './BlockingSound'
import {getActions} from './actions'

export interface IDefaults {}

export async function setupAll() {
    const blockingSound = new BlockingSound()

    return {
        name: 'audio' as const,
        requiredPlugins: [],
        elements: {},
        actions: getActions(blockingSound),
        convience: () => {},
        destroy: async () => {},
    } as const satisfies IPluginAppliance<IDefaults>
}