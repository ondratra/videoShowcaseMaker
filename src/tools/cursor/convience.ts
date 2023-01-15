// TODO: better (file) name than convience

import {ITargetPosition} from '../actions'
import {IElementSelector, mbDefault} from '../utils'
import {moveCursorTo, moveCursorToElement} from './actions'
import {ICursorElements} from './setup'
import {IPluginConvience, IPluginConvienceParameters} from '../plugin'

export interface IDefaults {
    duration: number
}


// TODO: refactor this -> atm it's not clear how to best past this variable to convience
const documentBody = document.querySelector('body') as HTMLElement


// TODO: refactor function parameters + get rid of any
//export const convience: (...args: any) => IPluginConvience = (cursorElements: ICursorElements, documentBody: HTMLElement, defaults: IDefaults) => ({
//export const convience = (cursorElements: ICursorElements, documentBody: HTMLElement, defaults: IDefaults) => ({
export const convience = (elements: ICursorElements) => (defaults: IDefaults) => ({
    moveCursorTo: (targetPosition: ITargetPosition, duration?: number) => moveCursorTo(elements.cursorContainer, targetPosition, mbDefault(duration, defaults.duration)),
    moveCursorToElement: (targetSelector: IElementSelector, duration?: number) => moveCursorToElement(documentBody, elements.cursorContainer, targetSelector, mbDefault(duration, defaults.duration)),
/*
    clickElement: (selector: IElementSelector) => asyncSequence([
        clickEffectOnly,
        clickElement(selector),
    ]),
    clickEffectOnly: () => asyncSequence([
        asyncDontWait(videoElements.runClickEffect),
        () => cursorClickSound.start(clickSoundUrl),
        delay(defaults.delayAfterClickEffect), // give a head start to the visual effect
    ]),
    */
//})
})
//}) as ((...args: unknown[]) => IPluginConvience)
