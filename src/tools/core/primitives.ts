import { IAsyncAction } from '../plugin'
import { findElement, IElementSelector } from '../utils'

export const delay = (timeout: number) => () => new Promise<void>((resolve) => setTimeout(resolve, timeout))

export const asyncSequence =
    (primitives: IAsyncAction[]): IAsyncAction =>
    () =>
        primitives.reduce(async (accPromise, item) => (await accPromise, await item()), Promise.resolve())

export const asyncDontWait =
    (primitive: IAsyncAction): IAsyncAction =>
    () => (primitive(), Promise.resolve())

export const triggerElementClick = (selector: IElementSelector) => async () => {
    findElement(selector).click()
}
