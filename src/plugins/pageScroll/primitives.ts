import { findElement, IElementSelector } from '../../tools/utils'

/**
 * Scrolls browser's viewport to a given place.
 */
export const pageScrollTo = (y: number) => () => {
    const scrollMaxY = Math.round(document.documentElement.scrollHeight - document.documentElement.clientHeight)
    const finalScrollY = Math.round(Math.min(scrollMaxY, y))
    const currentScrollY = Math.round(window.pageYOffset)

    if (finalScrollY == currentScrollY) {
        return Promise.resolve()
    }

    const scrollListener = (resolve: () => void) =>
        async function myListener() {
            if (Math.round(window.pageYOffset) != finalScrollY) {
                return
            }
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            window.removeEventListener('scroll', myListener)
            resolve()
        }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const resultPromise = new Promise<void>((resolve) => window.addEventListener('scroll', scrollListener(resolve)))
    window.scroll({
        left: 0,
        top: finalScrollY,
        behavior: 'smooth',
    })

    return resultPromise
}

/**
 * Scrolls browser's viewport to a given element.
 */
export const pageScrollToElement =
    (selector: IElementSelector, offsetY = 0) =>
    () => {
        const element = findElement(selector) as HTMLInputElement

        const absoluteOffsetY = element.getBoundingClientRect().top + window.pageYOffset
        const targetOffset = absoluteOffsetY + offsetY

        const resultPromise = pageScrollTo(targetOffset)()

        return resultPromise
    }
