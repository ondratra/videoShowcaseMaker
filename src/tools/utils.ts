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

/*
 * Type representing 2D position.
 */
export interface IPosition {
    x: number
    y: number
    add: (operand: IPosition) => IPosition
}

/*
 * Class representing 2D position.
 */
export class Position implements IPosition {
    public x: number
    public y: number

    public constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public add(secondPosition: IPosition): IPosition {
        return new Position(this.x + secondPosition.x, this.y + secondPosition.y)
    }
}

/**
 * Finds selected element in the document.
 */
export function findElement(selector: IElementSelector | HTMLElement): HTMLElement {
    if (selector instanceof HTMLElement) {
        return selector
    }

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

/**
 * Returns position of the requested element.
 */
export function getTargetPositionRect(targetSelector: IElementSelector | HTMLElement): DOMRect {
    const targetElement = findElement(targetSelector)
    const positionRect = targetElement.getBoundingClientRect()

    return positionRect
}

/**
 * Returns position of the requested element.
 */
export function getTargetPosition(targetSelector: IElementSelector | HTMLElement): IPosition {
    const targetElement = findElement(targetSelector)
    const positionWithoutMargin = getTargetPositionRect(targetSelector)

    const position = new Position(
        positionWithoutMargin.x - (parseInt(targetElement.style.marginLeft) || 0),
        positionWithoutMargin.y - (parseInt(targetElement.style.marginTop) || 0),
    )

    return position
}
