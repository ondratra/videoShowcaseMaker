import {IPluginAppliance} from '../plugin'
import * as actions from './actions'
import {convience, IDefaultsa} from './convience'

export const setupPlugin = () => async () => {
    return {
        name: 'core',
        requiredPlugins: [],
        elements: {},
        actions,
        convience,
        destroy: async () => {},
    } as const satisfies IPluginAppliance<IDefaultsa>
}
