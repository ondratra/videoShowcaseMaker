import { emptyPlugin, IPluginAppliance } from '../../tools/plugin'
import * as primitives from './primitives'

export interface IPageScrollPluginDefaults {}

/**
 * PageScroll plugin scrolls browser viewport.
 */
export const setupPlugin = () => async () => {
    // plugin definition
    return {
        ...emptyPlugin,

        name: 'pageScroll' as const,
        primitives,
    } as const satisfies IPluginAppliance<IPageScrollPluginDefaults>
}
