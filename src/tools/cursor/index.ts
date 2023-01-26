import { IPluginAppliance } from '../plugin'
import { composites, ICursorPluginDefaults } from './composites'
import * as rawPrimitives from './primitives'
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
export const recommendedConfiguration: IConfiguration = {
    clickEffectDuration: 4000,
}

/**
 * Configuration for Cursor plugin.
 */
export interface IConfiguration {
    clickEffectDuration: number
}

/**
 * Cursor plugin creates virtual cursor that can be moved around the screen and click on things.
 */
export const setupPlugin = (configuration: IConfiguration) => async () => {
    // pripare elements and primitives
    const elements = setup.createCursorElements()
    const primitives = {
        runClickEffect: () => setup.setupClickEffect(elements.clickEffectElement, configuration.clickEffectDuration),
        ...rawPrimitives,
    }

    // setup virtual onHover effect
    const clearHoverInterval = setup.setupHoverEffect(elements)

    // plugin definition
    return {
        name: 'cursor' as const,
        requiredPlugins: ['core', 'audio'],
        elements,
        primitives,
        composites: composites(elements, primitives),
        destroy: async () => {
            clearHoverInterval()
        },
    } as const satisfies IPluginAppliance<ICursorPluginDefaults>
}
