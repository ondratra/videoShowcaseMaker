import { findElement, getTargetPosition, IElementSelector } from '../../tools/utils'

export type IEventEmitterElementSelector = IElementSelector | Document

/**
 * Type guard for Document type.
 */
function isDocument(obj: any): obj is Document {
    return obj !== undefined && obj !== null && obj instanceof Document
}

/**
 * Setups emitting of mousemove events for virual cursor.
 */
function startEmitting(
    eventEmitterElementSelector: IEventEmitterElementSelector,
    cursorElement: HTMLElement,
    interval: number,
) {
    const emitInterval = setInterval(() => {
        const cursorPosition = getTargetPosition(cursorElement)

        const event = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: cursorPosition.x,
            clientY: cursorPosition.y,
        })

        const elementOrDocument = isDocument(eventEmitterElementSelector)
            ? eventEmitterElementSelector
            : findElement(eventEmitterElementSelector)

        elementOrDocument.dispatchEvent(event)
    }, interval)

    // create interval clear trigger
    const clearEffect = () => clearInterval(emitInterval)

    return clearEffect
}

/**
 * Stops emitting of mousemove events by virual cursor.
 */
function stopEmmiting(clearEffect: () => void) {
    clearEffect()
}

/**
 * Setups mechanism for emitting of mousemove events of virual cursor.
 */
export function setupMoveEventEmitter(cursorElement: HTMLElement, interval: number) {
    let clearEffect = () => {}

    const startEmittingMoveEvents = (eventEmitterElementSelector: IEventEmitterElementSelector) => {
        clearEffect = startEmitting(eventEmitterElementSelector, cursorElement, interval)
    }
    const stopEmittingMoveEvents = () => {
        stopEmmiting(clearEffect)
        clearEffect = () => {}
    }

    return {
        startEmittingMoveEvents,
        stopEmittingMoveEvents,
    }
}
