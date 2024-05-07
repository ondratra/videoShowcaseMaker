import { IAsyncAction } from '../../tools/plugin'
import { findElement, getTargetPosition, IElementSelector } from '../../tools/utils'

/**
 * Waits a given time.
 */
export const delay = (timeout: number) => () => new Promise<void>((resolve) => setTimeout(resolve, timeout))

/**
 * Executes a sequence of async actions.
 */
export const asyncSequence =
    (primitives: IAsyncAction[]): IAsyncAction =>
    () =>
        primitives.reduce(async (accPromise, item) => (await accPromise, await item()), Promise.resolve())

/**
 * Executes an async action and doesn't wait for its resolution. Effectively forks the execution flow.
 */
export const asyncDontWait =
    (primitive: IAsyncAction): IAsyncAction =>
    () => (primitive(), Promise.resolve())

/**
 * Triggers click event of the requested element.
 */
export const triggerElementClick = (selector: IElementSelector) => async () => {
    const element = findElement(selector)
    element.click()
    element.focus()
}

/**
 * Triggers mouse down event of the requested element.
 */
export const triggerElementMouseDown = (selector: IElementSelector, cursorElement: HTMLElement) => async () => {
    const element = findElement(selector)
    const cursorPosition = getTargetPosition(cursorElement)

    const event = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: cursorPosition.x,
        clientY: cursorPosition.y,
    })

    element.dispatchEvent(event)
    element.focus()
}

/**
 * Triggers mouse up event of the requested element.
 */
export const triggerElementMouseUp = (selector: IElementSelector) => async () => {
    const element = findElement(selector)

    const event = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
    })

    element.dispatchEvent(event)
    element.focus()
}
