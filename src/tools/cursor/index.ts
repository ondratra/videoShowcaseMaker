import {IPluginAppliance, IShowcaseMakerPlugin} from '../plugin'
import * as setup from './setup'
import {convience} from './convience'
import * as rawActions from './actions'

//export * as actions from './actions'
export * as setup from './setup'

// TODO remove this - somehow accept as parameter (probably already done in videoPlan)
const defaults = {
    clickEffectDuration: 2111
}

export async function setupAll() {
    const elements = setup.createCursorElements()
    const actions = {
        runClickEffect: setup.setupClickEffect(elements.clickEffectElement, defaults.clickEffectDuration),
        ...rawActions
    }

    const clearHoverInterval = setup.setupHoverEffect(elements)

    return {
        /*
        elements: setup.createCursorElements(),
        runClickEffect: setup.setupClickEffect(cursorElements.clickEffectElement, defaults.clickEffectDuration),
        setup.setupHoverEffect(cursorElements),
        */

        name: 'cursor',
        requiredPlugins: ['core'],
        elements,
        actions,
        //convience,
        convience: convience(elements, actions),
        destroy: async () => {
            clearHoverInterval()
        },
    //} satisfies IShowcaseMakerPlugin
    }
}
