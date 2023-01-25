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
})
