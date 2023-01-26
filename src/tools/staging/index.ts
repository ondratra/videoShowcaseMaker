import { IPluginAppliance } from '../plugin'
import { composites, IStagingPluginDefaults } from './composites'
import * as setup from './setup'

/**
 * Recommended/example values for default values for Staging plugin.
 */
export const recommendedDefaults: IStagingPluginDefaults = {}

/**
 * Staging plugin creates a curtain for fade-in / fade-out effects and a clipboard that helps to cut a video made
 * from the showcase.
 */
export const setupPlugin = () => async () => {
    const elements = setup.createStagingElements()
    const primitives = {}

    // plugin definition
    return {
        name: 'staging' as const,
        requiredPlugins: [],
        elements,
        primitives,
        composites: composites(elements, primitives),
        destroy: async () => {},
    } as const satisfies IPluginAppliance<IStagingPluginDefaults>
}
