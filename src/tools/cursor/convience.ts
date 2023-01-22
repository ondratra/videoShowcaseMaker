// TODO: better (file) name than convience

import {IElementSelector, mbDefault} from '../utils'
import {ITargetPosition, moveCursorTo, moveCursorToElement} from './actions'
import {ICursorElements} from './setup'
import {IPluginAppliance, IPluginConvience} from '../plugin'

export interface IDefaults {
    duration: number
    delayAfterClickEffect: number
    clickSoundUrl: string
}

// TODO: improve typeguard for pluginsLoaded - if possible, tie it with `requiredPlugins`
export const convience = (elements: ICursorElements, actions: {runClickEffect: () => () => Promise<void>}) => (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: IDefaults) => {
    const clickEffectOnly = pluginsLoaded.core.actions.asyncSequence([
        pluginsLoaded.core.actions.asyncDontWait(actions.runClickEffect()),
        pluginsLoaded.audio.actions.startPlayingAudio(defaults.clickSoundUrl),
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
}
