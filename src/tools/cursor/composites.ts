import { IPluginAppliance } from '../plugin'
import { IElementSelector, mbDefault } from '../utils'
import { ITargetPosition, primitives as rawPrimitives } from './primitives'
import { ICursorElements } from './setup'

/**
 * Default values for Cursor plugin composites.
 */
export interface ICursorPluginDefaults {
    duration: number
    delayAfterClickEffect: number
    clickSoundUrl: string
}

/**
 * Cursor plugin's composites.
 */
export const composites =
    (elements: ICursorElements, primitives: ReturnType<typeof rawPrimitives>) =>
    (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: ICursorPluginDefaults) => {
        // click's visual effect composite
        const clickEffectOnly = pluginsLoaded.core.primitives.asyncSequence([
            pluginsLoaded.core.primitives.asyncDontWait(primitives.runClickEffect()),
            pluginsLoaded.core.primitives.delay(defaults.delayAfterClickEffect), // give a head start to the visual effect
        ])

        return {
            /**
             * Moves cursor to selected position.
             */
            moveCursorTo: (targetPosition: ITargetPosition, duration?: number) =>
                primitives.moveCursorTo(
                    elements.cursorContainer,
                    targetPosition,
                    mbDefault(duration, defaults.duration),
                ),

            /**
             * Moves virtual cursor to target element's position.
             */
            moveCursorToElement: (targetSelector: IElementSelector, duration?: number) =>
                primitives.moveCursorToElement(
                    elements.cursorContainer,
                    targetSelector,
                    mbDefault(duration, defaults.duration),
                ),

            // TODO: share common logic of clickElement and clickEffectOnly with enhancements
            /**
             * Triggers target element's click event and shows visual effect at current cursor's position.
             * Cursor doesn't have to be on top of the element.
             */
            clickElement: (selector: IElementSelector) =>
                pluginsLoaded.core.primitives.asyncSequence([
                    clickEffectOnly,
                    pluginsLoaded.core.primitives.triggerElementClick(selector),
                ]),

            /**
             * Triggers click visual effect at current cursor's position..
             */
            clickEffectOnly: () => clickEffectOnly,
        }
    }
