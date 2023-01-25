import { IPluginAppliance } from '../plugin'
import { mbDefault } from '../utils'
import { delay } from './primitives'

/**
 * Default values for Core plugin composites.
 */
export interface ICorePluginDefaults {
    duration: number
}

/**
 * Core plugin's composites.
 */
export const composites = (
    pluginsLoaded: Record<string, IPluginAppliance<unknown>>,
    defaults: ICorePluginDefaults,
) => ({
    /**
     * Waits a given time.
     */
    delay: (duration?: number) => delay(mbDefault(duration, defaults.duration)),
})
