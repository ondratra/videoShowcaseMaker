import {IPluginAppliance} from '../plugin'
import * as setup from './setup'
import {convience, IDefaults} from './convience'
import * as rawActions from './actions'

export interface IConfiguration {
    clickEffectDuration: number,
}

export const setupPlugin = (configuration: IConfiguration) => async () => {
    const elements = setup.createCursorElements()
    const actions = {
        runClickEffect: () => setup.setupClickEffect(elements.clickEffectElement, configuration.clickEffectDuration),
        ...rawActions
    }

    const clearHoverInterval = setup.setupHoverEffect(elements)

    return {
        name: 'cursor' as const,
        requiredPlugins: ['core', 'audio'],
        elements,
        actions,
        convience: convience(elements, actions),
        destroy: async () => {
            clearHoverInterval()
        },
    } as const satisfies IPluginAppliance<IDefaults>
}
