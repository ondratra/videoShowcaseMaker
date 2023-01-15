// TODO: rename plugin (?)

import * as actions from './actions'
import {convience} from './convience'

export async function setupAll() {
    return {
        name: 'core',
        requiredPlugins: [],
        elements: {},
        //actions,
        actions, // TODO: fix typeguard for actions and add actions
        convience,
        destroy: async () => {},
    }
}
