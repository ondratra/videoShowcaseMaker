import { IPluginAppliance } from '../../tools/plugin'
import { IElementSelector } from '../../tools/utils'
import { ICursorPluginDefaults } from './composites'
import { IEventEmitterElementSelector } from './moveEmitter'
import { primitives as rawPrimitives } from './primitives'
import { ICursorElements } from './setup'

export interface ICursorPluginEnhancementsDefaults extends ICursorPluginDefaults {}

export const enhancements =
    // TODO: make sure defaults are properly passed and used
    //(pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: ICursorPluginEnhancementsDefaults) => {
    (elements: ICursorElements, primitives: ReturnType<typeof rawPrimitives>) => {
        return [
            {
                requiredPlugins: ['audio'],
                composites: (
                    pluginsLoaded: Record<string, IPluginAppliance<unknown>>,
                    defaults: ICursorPluginEnhancementsDefaults,
                ) => cursorWithAudioComposites(pluginsLoaded, elements, primitives, defaults),
            },
        ] as const
    }

/**
 * Cursor with Audio enables click sounds on click actions.
 */
function cursorWithAudioComposites(
    pluginsLoaded: Record<string, IPluginAppliance<unknown>>,
    elements: ICursorElements,
    primitives: ReturnType<typeof rawPrimitives>,
    defaults: ICursorPluginEnhancementsDefaults,
) {
    // click's audio & visual effect composite
    const clickEffectOnly = (audioUrl: string) =>
        pluginsLoaded.core.primitives.asyncSequence([
            pluginsLoaded.core.primitives.asyncDontWait(primitives.runClickEffect()),
            pluginsLoaded.audio.primitives.startPlayingAudio(audioUrl),
            pluginsLoaded.core.primitives.delay(defaults.delayAfterClickEffect), // give a head start to the visual effect
        ])

    return {
        /**
         * Triggers target element's click event and shows audio & visual effect at current cursor's position.
         * Cursor doesn't have to be on top of the element.
         */
        clickElement: (selector: IElementSelector) =>
            pluginsLoaded.core.primitives.asyncSequence([
                clickEffectOnly(defaults.soundUrls.click),
                pluginsLoaded.core.primitives.triggerElementClick(selector),
            ]),

        /**
         * Triggers click audio & visual effect at current cursor's position.
         */
        clickEffectOnly: () => clickEffectOnly(defaults.soundUrls.click),

        /**
         * Triggers target element's mousedown event and shows audio & visual effect at current cursor's position.
         * Cursor doesn't have to be on top of the element.
         */
        mouseDown: (emitMoveEventsOnElementSelector: IEventEmitterElementSelector) =>
            pluginsLoaded.core.primitives.asyncSequence([
                clickEffectOnly(defaults.soundUrls.mouseDown),
                primitives.mouseDown(emitMoveEventsOnElementSelector),
                pluginsLoaded.core.primitives.triggerElementMouseDown(
                    emitMoveEventsOnElementSelector,
                    elements.cursorContainer,
                ),
            ]),

        /**
         * Triggers target element's mouseup event and shows audio & visual effect at current cursor's position.
         * Cursor doesn't have to be on top of the element.
         */
        mouseUp: (emitMoveEventsOnElementSelector: IEventEmitterElementSelector) =>
            pluginsLoaded.core.primitives.asyncSequence([
                clickEffectOnly(defaults.soundUrls.mouseUp),
                primitives.mouseUp(),
                pluginsLoaded.core.primitives.triggerElementMouseUp(emitMoveEventsOnElementSelector),
            ]),
    }
}
