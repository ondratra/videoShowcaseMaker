// TODO: rename plugin (?)

import {IPluginAppliance} from '../plugin'
import * as actions from './actions'
import {convience, IDefaultsa} from './convience'

export async function setupAll() {
    return {
        name: 'core',
        requiredPlugins: [],
        elements: {},
        //actions,
        actions, // TODO: fix typeguard for actions and add actions
        convience,
        destroy: async () => {},
    //} satisfies IPluginAppliance<IDefaultsa>
    } as const satisfies IPluginAppliance<IDefaultsa>
}
