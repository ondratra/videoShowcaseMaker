import {IAsyncAction} from '../plugin'
import {findElement, IElementSelector} from '../utils'

export const delay = (timeout: number) => () => new Promise<void>((resolve) => setTimeout(resolve, timeout))

export const asyncSequence = (actions: IAsyncAction[]): IAsyncAction => () => actions.reduce(async (accPromise, item) => (await accPromise, await item()), Promise.resolve())

export const asyncDontWait = (action: IAsyncAction): IAsyncAction => () => (action(), Promise.resolve())

// TODO - what will distinguis action from convience? should be triggerElementClick action or convience?
export const triggerElementClick = (selector: IElementSelector) => async () => {
    findElement(selector).click()
}
