import { emptyPlugin, IPluginAppliance } from '../plugin'
import { composites, IStagingPluginDefaults } from './composites'
import * as setup from './setup'

/**
 * Recommended/example values for default values for Staging plugin.
 */
export const recommendedDefaults: IStagingPluginDefaults = {
    delayClapboard: 100, // clapboard should be higher than 1/60 for 60fps video recording
}

/**
 * Recommended/example configuration for Staging plugin.
 */
export const recommendedConfiguration: IConfiguration = {
    curtainFadeDuration: 2000,
}

/**
 * Configuration for Staging plugin.
 */
export interface IConfiguration {
    curtainFadeDuration: number
}

/**
 * Staging plugin creates a curtain for fade-in / fade-out effects and a clapboard that helps to cut a video made
 * from the showcase.
 */
export const setupPlugin = (configuration: IConfiguration) => async () => {
    const elements = setup.createStagingElements(configuration.curtainFadeDuration)
    const primitives = {}

    // plugin definition
    return {
        ...emptyPlugin,

        name: 'staging' as const,
        requiredPlugins: ['core'],
        elements,
        primitives,
        composites: composites(elements, primitives),
    } as const satisfies IPluginAppliance<IStagingPluginDefaults>
}
