import { getTargetPositionRect, IElementSelector, IPosition, Position } from '../../tools/utils'
import { IEventEmitterElementSelector } from './moveEmitter'
import { IConfiguration, ICursorElements, setupClickEffect } from './setup'

// TODO: fix runClickEffect -> currently it can't be run twice in succession - second effect will not be execute
//       and can be run only after first one has already ended

export const primitives = (elements: ICursorElements, configuration: IConfiguration) => {
    return {
        runClickEffect: () => setupClickEffect(elements.clickEffectElement, configuration.clickEffectDuration),
        moveCursorTo,
        moveCursorToElement,
        mouseDown: (eventEmitterElementSelector: IEventEmitterElementSelector) =>
            mouseDown(elements, eventEmitterElementSelector),
        mouseUp: () => mouseUp(elements),
    }
}

/**
 * Moves virtual cursor to target position.
 */
const moveCursorTo = (movingElement: HTMLElement, targetPosition: IPosition, duration: number) => (): Promise<void> => {
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
        const position = getTargetPositionRect(targetSelector)
        const centerPosition = new Position(position.x + position.width / 2, position.y + position.height / 2)

        return moveCursorTo(movingElement, centerPosition, duration)()
    }

/**
 * Emits virtual cursor's mousedown event.
 */
const mouseDown =
    (elements: ICursorElements, eventEmitterElementSelector: IEventEmitterElementSelector) =>
    async (): Promise<void> => {
        elements.startEmittingMoveEvents(eventEmitterElementSelector)
    }

/**
 * Emits virtual cursor's mouseup event.
 */
const mouseUp = (elements: ICursorElements) => async (): Promise<void> => {
    elements.stopEmittingMoveEvents()
}
