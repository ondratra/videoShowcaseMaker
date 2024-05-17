import { IPluginApplianceEnriched } from '../../tools/plugin'
import { mbDefault } from '../../tools/utils'
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
    pluginsLoaded: Record<string, IPluginApplianceEnriched<unknown>>,
    defaults: ICorePluginDefaults,
) => ({
    /**
     * Waits a given time.
     */
    delay: (duration?: number) => delay(mbDefault(duration, defaults.duration)),
})
