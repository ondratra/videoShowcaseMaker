import {IPluginAppliance, IShowcaseMakerPlugin} from '../plugin'
import * as setup from './setup'
import {convience} from './convience'

export * as actions from './actions'
export * as setup from './setup'

// TODO somehow accept as parameter
const defaults = {clickEffectDuration: 2111}

export async function setupAll() {
    const elements = setup.createCursorElements()

    const clearHoverInterval = setup.setupHoverEffect(elements)

    return {
        /*
        elements: setup.createCursorElements(),
        runClickEffect: setup.setupClickEffect(cursorElements.clickEffectElement, defaults.clickEffectDuration),
        setup.setupHoverEffect(cursorElements),
        */

        name: 'cursor',
        elements,
        actions: {
            runClickEffect: setup.setupClickEffect(elements.clickEffectElement, defaults.clickEffectDuration),
        },
        //convience,
        convience: convience(elements),
        destroy: async () => {
            clearHoverInterval()
        },
    //} satisfies IShowcaseMakerPlugin
    }
}
