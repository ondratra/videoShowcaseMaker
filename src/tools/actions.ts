// TODO: refactor everything

import {findElement, IElementSelector} from './utils'

export type IAsyncAction = () => Promise<void>

export const dontWaitAsync = (action: IAsyncAction) => (): Promise<void> => (action(), Promise.resolve())

export const delay = (timeout: number) => () => new Promise<void>((resolve) => setTimeout(resolve, timeout))

export const clickElement = (selector: IElementSelector) => async () => {
    findElement(selector).click()
}

export const writeIntoInput = (selector: IElementSelector, text: string | (() => string), strokeInterval: number) => () => new Promise<void>(resolve => {
    const element = findElement(selector) as HTMLInputElement

    const resultText = typeof text == 'string' ? text : text()

    if (strokeInterval == 0) {
        element.value = resultText
        element.dispatchEvent(new Event('change'))
        element.dispatchEvent(new Event('input'))

        resolve()
        return
    }

    let interval: ReturnType<typeof setInterval>
    let index = 0
    interval = setInterval(() => {
        element.value = resultText.substr(0, index)
        index++

        if (index <= resultText.length) {
            return
        }

        clearInterval(interval)
        element.dispatchEvent(new Event('change'))
        element.dispatchEvent(new Event('input'))
        resolve()
    }, strokeInterval)
})

export const selectText = (elementStart: HTMLElement, elementEnd: HTMLElement, offsetStart: number, offsetEnd: number) => async () => {
    const range = document.createRange()

    range.setStart(elementStart, offsetStart)
    range.setEnd(elementEnd, offsetEnd)

    const selection = window.getSelection() as Selection
    selection.removeAllRanges()
    selection.addRange(range)
}

export const clearTextSelection = () => async () => {
    const selection = window.getSelection()
    if (!selection) {
        return
    }
    selection.removeAllRanges()
}

export const asyncSequence = (actions: IAsyncAction[]): IAsyncAction => () => actions.reduce(async (accPromise, item) => (await accPromise, await item()), Promise.resolve())

export const asyncDontWait = (action: IAsyncAction): IAsyncAction => () => (action(), Promise.resolve())


export interface ITargetPosition {
    x: number
    y: number
}

export const moveCursorTo = (movingElement: HTMLElement, targetPosition: ITargetPosition, duration: number) => (): Promise<void> => {
    const resultPromise = duration > 0
        ? new Promise<void>(resolve => movingElement.addEventListener('transitionend', () => resolve(), {once: true}))
        : Promise.resolve()

    movingElement.style.transitionDuration = duration + 'ms'
    movingElement.style.transform = `translate(${targetPosition.x}px, ${targetPosition.y}px)`

    return resultPromise
}

export const moveCursorToElement = (rootElement: HTMLElement, movingElement: HTMLElement, targetSelector: IElementSelector, duration: number) => (): Promise<void> => {
    const position = getTargetPosition(rootElement, targetSelector)
    const centerPosition = {
        x: position.x + position.width / 2,
        y: position.y + position.height / 2,
    }

    return moveCursorTo(movingElement, centerPosition, duration)()
}

function getTargetPosition(rootElement: HTMLElement, targetSelector: IElementSelector): DOMRect {
    const targetElement = findElement(targetSelector) as HTMLElement
    const offset = targetElement.getBoundingClientRect()

    return offset
}
