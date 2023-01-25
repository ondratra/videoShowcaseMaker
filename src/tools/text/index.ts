import { IPluginAppliance } from '../plugin'
import { composites, ITextPluginDefaults } from './composites'
import * as primitives from './primitives'

/**
 * Recommended/example values for default values for Core plugin.
 */
export const recommendedDefaults: ITextPluginDefaults = {
    strokeInterval: 30,
}

/**
 * Text plugin creates virtual text that can be moved around the screen and click on things.
 */
export const setupPlugin = () => async () => {
    // plugin definition
    return {
        name: 'text' as const,
        requiredPlugins: ['cursor'],
        elements: {},
        primitives,
        composites,
        destroy: async () => {
            await primitives.clearTextSelection()()
        },
    } as const satisfies IPluginAppliance<ITextPluginDefaults>
}
