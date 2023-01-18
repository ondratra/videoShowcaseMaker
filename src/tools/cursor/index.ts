import {IPluginAppliance, IShowcaseMakerPlugin} from '../plugin'
import * as setup from './setup'
import {convience, IDefaults} from './convience'
import * as rawActions from './actions'

//export * as actions from './actions'
export * as setup from './setup'

// TODO remove this!!! somehow accept as parameter (probably already done in videoPlan)
const defaults = {
    clickEffectDuration: 1400,
}

export async function setupAll() {
    const elements = setup.createCursorElements()
    const actions = {
        runClickEffect: () => setup.setupClickEffect(elements.clickEffectElement, defaults.clickEffectDuration),
        ...rawActions
    }

    const clearHoverInterval = setup.setupHoverEffect(elements)

    return {
        name: 'cursor' as const,
        requiredPlugins: ['core'],
        elements,
        actions,
        convience: convience(elements, actions),
        destroy: async () => {
            clearHoverInterval()
        },
    } as const satisfies IPluginAppliance<IDefaults>
}
