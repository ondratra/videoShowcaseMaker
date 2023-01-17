// TODO: better (file) name than convience

import {IElementSelector, mbDefault} from '../utils'
import {ITargetPosition, moveCursorTo, moveCursorToElement} from './actions'
import {ICursorElements} from './setup'
import {IPluginAppliance, IPluginConvience} from '../plugin'

export interface IDefaults {
    duration: number
    delayAfterClickEffect: number
}


// TODO: refactor this -> atm it's not clear how to best past this variable to convience
const documentBody = document.querySelector('body') as HTMLElement


// TODO: refactor function parameters + get rid of any
// TODO: improve typeguard for pluginsLoaded - if possible, tie it with `requiredPlugins`
// TODO: get rid of `any`
//export const convience: (...args: any) => IPluginConvience = (cursorElements: ICursorElements, documentBody: HTMLElement, defaults: IDefaults) => ({
//export const convience = (cursorElements: ICursorElements, documentBody: HTMLElement, defaults: IDefaults) => ({
export const convience = (elements: ICursorElements, actions: any) => (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: IDefaults) => {
    const clickEffectOnly = pluginsLoaded.core.actions.asyncSequence([
        pluginsLoaded.core.actions.asyncDontWait(actions.runClickEffect()),
        // TODO: enable after sound is imported
        //() => cursorClickSound.start(clickSoundUrl),
        pluginsLoaded.core.actions.delay(defaults.delayAfterClickEffect), // give a head start to the visual effect
    ])

    return {
        moveCursorTo: (targetPosition: ITargetPosition, duration?: number) => moveCursorTo(elements.cursorContainer, targetPosition, mbDefault(duration, defaults.duration)),
        moveCursorToElement: (targetSelector: IElementSelector, duration?: number) => moveCursorToElement(elements.cursorContainer, targetSelector, mbDefault(duration, defaults.duration)),

        clickElement: (selector: IElementSelector) => pluginsLoaded.core.actions.asyncSequence([
            clickEffectOnly,
            pluginsLoaded.core.actions.triggerElementClick(selector),
        ]),
        clickEffectOnly: () => clickEffectOnly,
    }
//})
}
//}) as ((...args: unknown[]) => IPluginConvience)
