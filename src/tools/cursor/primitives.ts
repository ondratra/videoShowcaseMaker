import { findElement, IElementSelector } from '../utils'

/**
 * Cursor's 2D coordinance.
 */
export interface ITargetPosition {
    x: number
    y: number
}

/**
 * Moves virtual cursor to target position.
 */
export const moveCursorTo =
    (movingElement: HTMLElement, targetPosition: ITargetPosition, duration: number) => (): Promise<void> => {
        const resultPromise =
            duration > 0
                ? new Promise<void>((resolve) =>
                      movingElement.addEventListener('transitionend', () => resolve(), { once: true }),
                  )
                : Promise.resolve()

        movingElement.style.transitionDuration = duration + 'ms'
        movingElement.style.transform = `translate(${targetPosition.x}px, ${targetPosition.y}px)`

        return resultPromise
    }

/**
 * Moves virtual cursor to target element's position.
 */
export const moveCursorToElement =
    (movingElement: HTMLElement, targetSelector: IElementSelector, duration: number) => (): Promise<void> => {
        const position = getTargetPosition(targetSelector)
        const centerPosition = {
            x: position.x + position.width / 2,
            y: position.y + position.height / 2,
        }

        return moveCursorTo(movingElement, centerPosition, duration)()
    }

/**
 * Returns position of the requested element.
 */
function getTargetPosition(targetSelector: IElementSelector): DOMRect {
    const targetElement = findElement(targetSelector) as HTMLElement
    const offset = targetElement.getBoundingClientRect()

    return offset
}
