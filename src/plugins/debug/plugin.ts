import { emptyPlugin, IPluginAppliance } from '../../tools/plugin'
import * as primitives from './primitives'

// see note in `src/index.ts` for understanding why this is here
export type * as primitives from './primitives'

/**
 * Default values for Debug plugin composites.
 */
export interface IDebugPluginDefaults {}

/**
 * Recommended/example values for default values for Debug plugin.
 */
export const recommendedDefaults: IDebugPluginDefaults = {} satisfies Partial<IDebugPluginDefaults>

/**
 * Debug plugin provides utilities for debugging showcase plan.
 */
export const setupPlugin = () => async () => {
    // plugin definition
    return {
        ...emptyPlugin,

        name: 'debug',
        primitives,
    } as const satisfies IPluginAppliance<IDebugPluginDefaults>
}
