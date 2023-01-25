import { IPluginAppliance } from '../plugin'
import { composites, ICorePluginDefaults } from './composites'
import * as primitives from './primitives'

/**
 * Core plugin exposes utilities that are either essential for other plugins or common in a showcase plan building.
 */
export const setupPlugin = () => async () => {
    return {
        name: 'core',
        requiredPlugins: [],
        elements: {},
        primitives,
        composites,
        destroy: async () => {},
    } as const satisfies IPluginAppliance<ICorePluginDefaults>
}
