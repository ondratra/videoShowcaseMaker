import { emptyPlugin, IPluginAppliance } from '../../tools/plugin'
import { composites, ICursorPluginDefaults } from './composites'
import { enhancements, ICursorPluginEnhancementsDefaults } from './enhancements'
import { primitives as rawPrimitives } from './primitives'
import * as setup from './setup'

/**
 * Recommended/example values for default values for Cursor plugin.
 */
export const recommendedDefaults: Omit<ICursorPluginDefaults, 'clickSoundUrl'> = {
    duration: 1000,
    delayAfterClickEffect: 300,
} satisfies Partial<ICursorPluginDefaults>

/**
 * Recommended/example configuration for Cursor plugin.
 */
export const recommendedConfiguration: setup.IConfiguration = {
    clickEffectDuration: 4000,
}

/**
 * Cursor plugin creates virtual cursor that can be moved around the screen and click on things.
 *
 * If Audio plugin's also loaded, clicks of the virtual cursor will make sounds.
 */
export const setupPlugin = (configuration: setup.IConfiguration) => async () => {
    // pripare elements and primitives
    const elements = setup.createCursorElements()
    const primitives = rawPrimitives(elements, configuration)

    // setup virtual onHover effect
    const clearHoverInterval = setup.setupHoverEffect(elements)

    // plugin definition
    return {
        ...emptyPlugin,

        name: 'cursor' as const,
        requiredPlugins: ['core'],
        elements,
        primitives,
        composites: composites(elements, primitives),
        enhancements: enhancements(elements, primitives),
        destroy: async () => {
            clearHoverInterval()
        },
    } as const satisfies IPluginAppliance<ICursorPluginDefaults, ICursorPluginEnhancementsDefaults>
}
