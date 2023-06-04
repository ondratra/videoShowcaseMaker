/**
 * Creates overlay for a plugin that can insert it's HTML content into it. It will cover the whole screen.
 */
export function createOverlay(name: string, content?: string, styles?: string): HTMLElement {
    const overlayElement = document.createElement('div')

    // TODO: add way to set z-index for the layer so that multiple layers can be sorted as needed
    // TODO: prevent multiple overlays having the same id (if showcase plan runs multiple times -> id is duplicated)

    overlayElement.id = 'showcaseOverlay_' + name
    overlayElement.style.position = 'fixed'
    overlayElement.style.zIndex = '9999'
    overlayElement.style.width = '100%'
    overlayElement.style.height = '100%'
    overlayElement.style.left = '0px'
    overlayElement.style.top = '0px'
    overlayElement.style.pointerEvents = 'none'

    overlayElement.innerHTML = '' + (content || '') + (styles ? `<style>${styles}</style>` : '')

    return overlayElement
}

/**
 * Type for CSS selector or combination of CSS selector and index of the element of interest among found elements.
 */
export type IElementSelector = string | [number, string]

/**
 * Finds selected element in the document.
 */
export function findElement(selector: IElementSelector): HTMLElement {
    if (!Array.isArray(selector)) {
        const result = document.querySelector(selector) as HTMLElement

        return result
    }

    const result = document.querySelectorAll(selector[1])[selector[0]] as HTMLElement

    return result
}

/**
 * Returns the given value or a default value if no value is given.
 */
export const mbDefault = <T>(value: T | undefined, defaultValue: T): T =>
    typeof value == 'undefined' ? defaultValue : value
