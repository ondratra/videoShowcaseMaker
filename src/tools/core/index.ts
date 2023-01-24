import { IPluginAppliance } from '../plugin'
import { composites, IDefaultsa } from './composites'
import * as primitives from './primitives'

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
