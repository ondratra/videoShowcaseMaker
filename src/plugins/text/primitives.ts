import { findElement, IElementSelector } from '../../tools/utils'

/**
 * Writes text into HTML input element.
 */
export const writeIntoInput =
    (selector: IElementSelector, text: string | (() => string), strokeInterval: number) => () =>
        new Promise<void>((resolve) => {
            const element = findElement(selector) as HTMLInputElement

            const resultText = typeof text == 'string' ? text : text()

            if (strokeInterval == 0) {
                element.value = resultText
                element.dispatchEvent(new Event('change'))
                element.dispatchEvent(new Event('input'))

                resolve()
                return
            }

            let index = 0
            const interval = setInterval(() => {
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

/**
 * Selects text from inside of the given element or between two elements. Clears previous text selection.
 */
export const selectText =
    (elementStart: HTMLElement, elementEnd: HTMLElement, offsetStart: number, offsetEnd: number) => async () => {
        const range = document.createRange()

        range.setStart(elementStart, offsetStart)
        range.setEnd(elementEnd, offsetEnd)

        const selection = window.getSelection() as Selection
        selection.removeAllRanges()
        selection.addRange(range)
    }

/**
 * Clears text selection.
 */
export const clearTextSelection = () => async () => {
    const selection = window.getSelection() as Selection
    selection.removeAllRanges()
}
