import { IPluginAppliance } from '../plugin'
import { IElementSelector } from '../utils'
import { ICursorPluginDefaults } from './composites'
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
                ) => cursorWithAudioComposites(pluginsLoaded, primitives, defaults),
            },
        ] as const
    }

/**
 * Cursor with Audio enables click sounds on click actions.
 */
function cursorWithAudioComposites(
    pluginsLoaded: Record<string, IPluginAppliance<unknown>>,
    primitives: ReturnType<typeof rawPrimitives>,
    defaults: ICursorPluginEnhancementsDefaults,
) {
    // click's audio & visual effect composite
    const clickEffectOnly = pluginsLoaded.core.primitives.asyncSequence([
        pluginsLoaded.core.primitives.asyncDontWait(primitives.runClickEffect()),
        pluginsLoaded.audio.primitives.startPlayingAudio(defaults.clickSoundUrl),
        pluginsLoaded.core.primitives.delay(defaults.delayAfterClickEffect), // give a head start to the visual effect
    ])

    return {
        /**
         * Triggers target element's click event and shows audio & visual effect at current cursor's position.
         * Cursor doesn't have to be on top of the element.
         */
        clickElement: (selector: IElementSelector) =>
            pluginsLoaded.core.primitives.asyncSequence([
                clickEffectOnly,
                pluginsLoaded.core.primitives.triggerElementClick(selector),
            ]),

        /**
         * Triggers click audio & visual effect at current cursor's position..
         */
        clickEffectOnly: () => clickEffectOnly,
    }
}
