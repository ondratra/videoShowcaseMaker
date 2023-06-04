import { findElement, IElementSelector } from '../utils'
import { IConfiguration, ICursorElements, setupClickEffect } from './setup'

/**
 * Cursor's 2D coordinance.
 */
export interface ITargetPosition {
    x: number
    y: number
}

// TODO: fix runClickEffect -> currently it can't be run twice in succession - second effect will not be execute
//       and can be run only after first one has already ended

export const primitives = (elements: ICursorElements, configuration: IConfiguration) => {
    return {
        runClickEffect: () => setupClickEffect(elements.clickEffectElement, configuration.clickEffectDuration),
        moveCursorTo,
        moveCursorToElement,
    }
}

/**
 * Moves virtual cursor to target position.
 */
const moveCursorTo =
    (movingElement: HTMLElement, targetPosition: ITargetPosition, duration: number) => (): Promise<void> => {
        const resultPromise =
            duration > 0
                ? new Promise<void>((resolve) =>
                      movingElement.addEventListener('transitionend', () => resolve(), { once: true }),
                  )
                : Promise.resolve()

        movingElement.style.transitionDuration = duration + 'ms'
        movingElement.style.transform = `translate(${targetPosition.x}px, ${targetPosition.y}px)`

        return resultPromise as any
    }

/**
 * Moves virtual cursor to target element's position.
 */
const moveCursorToElement =
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
