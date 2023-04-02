import { emptyPlugin, IPluginAppliance } from '../plugin'
import { composites, ICorePluginDefaults } from './composites'
import * as primitives from './primitives'

/**
 * Recommended/example values for default values for Core plugin.
 */
export const recommendedDefaults: ICorePluginDefaults = {
    duration: 1000,
}

/**
 * Core plugin exposes utilities that are either essential for other plugins or common in a showcase plan building.
 */
export const setupPlugin = () => async () => {
    return {
        ...emptyPlugin,

        name: 'core',
        primitives,
        composites,
    } as const satisfies IPluginAppliance<ICorePluginDefaults>
}
