
export function createOverlay(name: string, content?: string, styles?: string): HTMLElement {
    const overlayElement = document.createElement('div')
    overlayElement.id = 'videoOverlay_' + name
    overlayElement.style.position = 'fixed'
    overlayElement.style.zIndex = '9999'
    overlayElement.style.width = '100%'
    overlayElement.style.height = '100%'
    overlayElement.style.left = '0px'
    overlayElement.style.top = '0px'
    overlayElement.style.pointerEvents = 'none'

    overlayElement.innerHTML = ''
        + (content || '')
        + (styles ? `<style>${styles}</style>` : '')

    return overlayElement
}

export type IElementSelector = string | [number, string]

export function findElement(selector: IElementSelector): HTMLElement {
    if (!Array.isArray(selector)) {
        const result = document.querySelector(selector) as HTMLElement

        return result
    }

    const result = document.querySelectorAll(selector[1])[selector[0]] as HTMLElement

    return result
}

export const mbDefault = <T>(value: T | undefined, defaultValue: T): T => typeof value == 'undefined' ? defaultValue : value
