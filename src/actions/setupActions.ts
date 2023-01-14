import {asyncSequence, asyncDontWait, delay, clickElement, moveCursorTo, moveCursorToElement} from '../tools/actions'
import {IElementSelector} from '../tools/utils'
import {BlockingSound} from '../tools/audio'
import {IActionsSettings, ITargetPosition} from './interfaces'
import {defaults} from '../flows/defaults'

// TODO: make this configurable
const cdnUrlVolume = 'tmpCDN_TODO'
const clickSoundUrl = cdnUrlVolume + '/dev/audio/misc/click.ogg'

const mbDefault = <T>(value: T | undefined, defaultValue: T): T => typeof value == 'undefined' ? defaultValue : value

export function setupActions(settings: IActionsSettings) {
    const videoElements = settings.videoElements
    const cursorClickSound = new BlockingSound()

    const clickEffectOnly = asyncSequence([
        asyncDontWait(videoElements.runClickEffect),
        () => cursorClickSound.start(clickSoundUrl),
        delay(defaults.delayAfterClickEffect), // give a head start to the visual effect
    ])

    const actions = {
        // misc
        delay: (duration?: number) => delay(mbDefault(duration, defaults.duration)),

        // cursor
        moveCursorTo: (targetPosition: ITargetPosition, duration?: number) => moveCursorTo(videoElements.cursorElements.cursorContainer, targetPosition, mbDefault(duration, defaults.duration)),
        moveCursorToElement: (targetSelector: IElementSelector, duration?: number) => moveCursorToElement(videoElements.documentBody, videoElements.cursorElements.cursorContainer, targetSelector, mbDefault(duration, defaults.duration)),
        clickElement: (selector: IElementSelector) => asyncSequence([
            clickEffectOnly,
            clickElement(selector),
        ]),
        clickEffectOnly: () => asyncSequence([
            asyncDontWait(videoElements.runClickEffect),
            () => cursorClickSound.start(clickSoundUrl),
            delay(defaults.delayAfterClickEffect), // give a head start to the visual effect
        ]),
    }

    return {actions}
}
