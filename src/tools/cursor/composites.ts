import {IElementSelector, mbDefault} from '../utils'
import {ITargetPosition, moveCursorTo, moveCursorToElement} from './primitives'
import {ICursorElements} from './setup'
import {IPluginAppliance} from '../plugin'

export interface IDefaults {
    duration: number
    delayAfterClickEffect: number
    clickSoundUrl: string
}

export const composites = (elements: ICursorElements, primitives: {runClickEffect: () => () => Promise<void>}) => (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: IDefaults) => {
    const clickEffectOnly = pluginsLoaded.core.primitives.asyncSequence([
        pluginsLoaded.core.primitives.asyncDontWait(primitives.runClickEffect()),
        pluginsLoaded.audio.primitives.startPlayingAudio(defaults.clickSoundUrl),
        pluginsLoaded.core.primitives.delay(defaults.delayAfterClickEffect), // give a head start to the visual effect
    ])

    return {
        moveCursorTo: (targetPosition: ITargetPosition, duration?: number) => moveCursorTo(elements.cursorContainer, targetPosition, mbDefault(duration, defaults.duration)),
        moveCursorToElement: (targetSelector: IElementSelector, duration?: number) => moveCursorToElement(elements.cursorContainer, targetSelector, mbDefault(duration, defaults.duration)),

        clickElement: (selector: IElementSelector) => pluginsLoaded.core.primitives.asyncSequence([
            clickEffectOnly,
            pluginsLoaded.core.primitives.triggerElementClick(selector),
        ]),
        clickEffectOnly: () => clickEffectOnly,
    }
}
