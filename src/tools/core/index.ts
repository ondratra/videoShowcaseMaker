import {IPluginAppliance} from '../plugin'
import * as primitives from './primitives'
import {composites, IDefaultsa} from './composites'

export const setupPlugin = () => async () => {
    return {
        name: 'core',
        requiredPlugins: [],
        elements: {},
        primitives,
        composites,
        destroy: async () => {},
    } as const satisfies IPluginAppliance<IDefaultsa>
}
