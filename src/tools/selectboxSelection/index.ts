import { emptyPlugin, IPluginAppliance } from '../plugin'
import { enhancements, SelectboxSelectionPluginEnhancementsDefaults } from './enhancements'
import { primitives as rawPrimitives } from './primitives'
import * as setup from './setup'
import * as utilities from './utilities'

export interface ISelectboxSelectionPluginDefaults {}

/**
 * SelectboxSelection plugin creates a curtain for fade-in / fade-out effects and a clapboard that helps to cut a video made
 * from the showcase.
 */
export const setupPlugin = () => async () => {
    const elements = setup.createSelectboxSelectionElements()
    const primitives = rawPrimitives(elements)

    // plugin definition
    return {
        ...emptyPlugin,

        name: 'selectboxSelection' as const,
        elements,
        primitives,
        enhancements: enhancements(elements, primitives),
        utilities,
    } as const satisfies IPluginAppliance<
        ISelectboxSelectionPluginDefaults,
        SelectboxSelectionPluginEnhancementsDefaults
    >
}
