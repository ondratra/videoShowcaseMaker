import { IAsyncAction } from '../plugin'
import { findElement, IElementSelector } from '../utils'

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
