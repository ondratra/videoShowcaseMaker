import { IPluginAppliance } from '../plugin'
import { composites, IDefaults } from './composites'
import * as rawActions from './primitives'
import * as setup from './setup'

export interface IConfiguration {
    clickEffectDuration: number
}

export const setupPlugin = (configuration: IConfiguration) => async () => {
    const elements = setup.createCursorElements()
    const primitives = {
        runClickEffect: () => setup.setupClickEffect(elements.clickEffectElement, configuration.clickEffectDuration),
        ...rawActions,
    }

    const clearHoverInterval = setup.setupHoverEffect(elements)

    return {
        name: 'cursor' as const,
        requiredPlugins: ['core', 'audio'],
        elements,
        primitives,
        composites: composites(elements, primitives),
        destroy: async () => {
            clearHoverInterval()
        },
    } as const satisfies IPluginAppliance<IDefaults>
}
