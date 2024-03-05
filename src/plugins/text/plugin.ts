import { emptyPlugin, IPluginAppliance } from '../../tools/plugin'
import { composites, ITextPluginDefaults } from './composites'
import * as primitives from './primitives'

/**
 * Recommended/example values for default values for Text plugin.
 */
export const recommendedDefaults: ITextPluginDefaults = {
    //strokeInterval: 30,
    strokeInterval: 100,
}

/**
 * Text plugin creates virtual text that can be moved around the screen and click on things.
 */
export const setupPlugin = () => async () => {
    // plugin definition
    return {
        ...emptyPlugin,

        // TODO: add enhancements for audio plugin that plays sound on text input write

        name: 'text' as const,
        // TODO: add enhancements for cursor plugin
        // requiredPlugins: ['core', 'cursor'], // old dependency -> remove after TODO is done
        requiredPlugins: ['core'],
        primitives,
        composites,
        destroy: async () => {
            await primitives.clearTextSelection()()
        },
    } as const satisfies IPluginAppliance<ITextPluginDefaults>
}
