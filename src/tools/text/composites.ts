import { IPluginAppliance } from '../plugin'
import { findElement, IElementSelector, mbDefault } from '../utils'
import { selectText, writeIntoInput } from './primitives'

/**
 * Default values for Text plugin composites.
 */
export interface ITextPluginDefaults {
    strokeInterval: number
}

/**
 * Text plugin's composites.
 */
export const composites = (
    pluginsLoaded: Record<string, IPluginAppliance<unknown>>,
    defaults: ITextPluginDefaults,
) => ({
    /**
     * Selects text from inside of the given element or between two elements. Clears previous text selection.
     */
    selectElementText: (selector: IElementSelector, offsetStart?: number, offsetEnd?: number) => () => {
        const element = findElement(selector)
        const result = selectText(
            element.firstChild as HTMLElement,
            element.firstChild as HTMLElement,
            offsetStart || 0,
            offsetEnd || element.innerText.length,
        )()

        return result
    },

    /**
     * Writes text into HTML input element.
     */
    writeIntoInput: (selector: IElementSelector, text: string | (() => string), strokeInterval?: number) =>
        writeIntoInput(selector, text, mbDefault(strokeInterval, defaults.strokeInterval)),

    // TODO: here is an example situation when proper typings for pluginsLoaded is missing
    //       atm nonexisting primitives/composites may be called here and it won't be discovered during compilation
    // TODO: handle calling composites of other plugins - atm `pluginsLoaded` & `defaults`(!) needs to be provided
    //       that means plugin's defaults need to contain defaults of all of its required plugins
    // TODO: add this as an enhancement using cursor plugin
    /*
    clickInputAndWriteIntoIt: (selector: IElementSelector, text: string | (() => string), strokeInterval?: number) => pluginsLoaded.core.primitives.asyncSequence([
        pluginsLoaded.cursor.composites.moveCursorToElement(selector),
        pluginsLoaded.core.primitives.delay(),
        pluginsLoaded.cursor.primitives.clickElement(selector),
        pluginsLoaded.core.primitives.delayBeforeWrite(),
        pluginsLoaded.cursor.primitives.writeIntoInput(selector, text, strokeInterval),
        pluginsLoaded.core.primitives.delay(),
    ]),
    */
})
