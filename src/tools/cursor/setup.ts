import { IPluginElements } from '../plugin'
import { createOverlay } from '../utils'

/**
 * Creates overlay for a plugin that can insert it's HTML content into it. It will cover the whole screen.
 */
export interface ICursorElements extends IPluginElements {
    cursorContainer: HTMLElement
    cursorElement: HTMLElement
    clickEffectElement: HTMLElement
    overlayElement: HTMLElement
}

/**
 * Creates elements used by cursor plugin.
 */
export function createCursorElements(): ICursorElements {
    const cursorContainer = document.createElement('div')
    cursorContainer.style.width = '100px'
    cursorContainer.style.height = '100px'
    cursorContainer.style.marginLeft = '-50px'
    cursorContainer.style.marginTop = '-50px'
    cursorContainer.style.position = 'absolute'
    cursorContainer.style.left = '0px'
    cursorContainer.style.top = '0px'
    cursorContainer.style.transform = 'translate(0px, 0px)'

    const cursorElement = document.createElement('div')
    cursorElement.style.fontSize = '18px'
    cursorElement.style.position = 'absolute'
    cursorElement.style.left = '50%'
    cursorElement.style.top = '50%'
    cursorElement.style.color = '#eee'
    cursorElement.style.stroke = '#000'
    cursorElement.style.strokeWidth = '10px'
    // shadow and stroke are two valid alternative to highlight
    // cursorElement.style.textShadow = '#000 0px 0px 2px'

    // cursor icon has to be in separate div, otherwise it can break hover effect
    // due to some Font Awesome div replacement (or something like that)
    const tmp = document.createElement('div')
    tmp.classList.add('fas')
    tmp.classList.add('fa-mouse-pointer')

    cursorElement.appendChild(tmp)

    const clickEffectElement = document.createElement('div')
    clickEffectElement.style.width = '100px'
    clickEffectElement.style.height = '100px'
    clickEffectElement.style.position = 'absolute'
    clickEffectElement.style.left = '0px'
    clickEffectElement.style.top = '0px'
    clickEffectElement.style.stroke = '#aaa'
    clickEffectElement.style.transform = 'scale(0)'

    clickEffectElement.innerHTML = `
        <svg height="100" width="100">
            <circle cx="50" cy="50" r="48" stroke-width="3" fill="transparent" />
        </svg>
    `

    // create overlay and insert all elements
    const overlayElement = createOverlay('cursor')

    cursorContainer.appendChild(cursorElement)
    cursorContainer.appendChild(clickEffectElement)
    overlayElement.appendChild(cursorContainer)

    return {
        cursorContainer,
        cursorElement,
        clickEffectElement,
        overlayElement,
    }
}

/**
 * Setups mouse click audio & visual effect.
 */
export function setupClickEffect(clickEffectElement: HTMLElement, duration: number): () => Promise<void> {
    // on-click-effect-end listener
    const transitionListener = (resolve: () => void, onEnd: () => Promise<void>) =>
        async function myListener() {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            clickEffectElement.removeEventListener('transitionend', myListener)

            clickEffectElement.style.transitionDuration = '0ms'
            clickEffectElement.style.stroke = '#aaa'
            clickEffectElement.style.transform = 'scale(0)'
            await onEnd()
            resolve()
        }

    // on-click-effect trigger
    const runCursorClickEffect = () =>
        new Promise<void>((resolve) => {
            clickEffectElement.addEventListener(
                'transitionend',
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                transitionListener(resolve, async () => {}),
            )
            clickEffectElement.style.transitionDuration = duration + 'ms'
            clickEffectElement.style.stroke = 'transparent'
            clickEffectElement.style.transform = 'scale(1)'
        })

    return runCursorClickEffect
}

/**
 * Setups virtual onHover effect and returns function that can destroy it.
 */
export function setupHoverEffect(cursorElements: ICursorElements): () => void {
    const interval = 50

    const hoverClass = '__showcase_virtual_hover'

    prepareVirtualStyles(cursorElements.cursorContainer, hoverClass)
    const clearEffect = prepareHoverInterval(cursorElements.cursorElement, interval, hoverClass)

    return clearEffect
}

/**
 * Prepares and inserts to document a virtual CSS :hover style that reacts on hover of both real cursor
 * and virtual one set up by this plugin.
 */
function prepareVirtualStyles(cursorContainer: HTMLElement, hoverClass: string) {
    // filter elements with hover effect defined
    const filter = (item: CSSStyleRule) => !!item.selectorText && !!item.selectorText.match(/:hover/)
    const rules = getCssRules(filter)

    // prepare virtual onHover class for each element
    const rulesText = rules
        .map((item) => item.cssText)
        .map((item) => item.replace(':hover', '.' + hoverClass))
        .join('\n')

    // insert virtual onHover styles to document
    const styleElement = document.createElement('style')
    styleElement.innerHTML = rulesText
    cursorContainer.appendChild(styleElement)
}

/**
 * Finds and returns CSS rules selected by a callback from document's existing CSS rules.
 */
function getCssRules(filter: (rule: CSSStyleRule) => boolean): CSSStyleRule[] {
    const styleSheets = document.styleSheets

    // iterate over stylesheets and return filtered rules
    const rules = Object.keys(styleSheets).reduce((acc, styleSheetKey) => {
        const styleSheetKeyNumber = parseInt(styleSheetKey) // Object.keys auto converts keys to 'string', but we need proper numbers

        // iterate over single stylesheet's CSS rules
        const styleSheetRules = Object.keys(styleSheets[styleSheetKeyNumber].cssRules).reduce((innerAcc, ruleKey) => {
            const ruleKeyNumber = parseInt(ruleKey) // Object.keys auto converts keys to 'string', but we need proper numbers
            const rule = styleSheets[styleSheetKeyNumber].cssRules[ruleKeyNumber] as CSSStyleRule

            if (!filter(rule)) {
                return innerAcc
            }

            return [...innerAcc, rule]
        }, [] as CSSStyleRule[])

        return [...acc, ...styleSheetRules]
    }, [] as CSSStyleRule[])

    return rules
}

/**
 * Prepares checking mechanism that activates virtual onHover effect when real or virtual cursor
 * moves over elements with onHover effect set.
 */
function prepareHoverInterval(cursorElement: HTMLElement, interval: number, hoverClass: string) {
    // element with active onHover effect
    let lastElement: Element | null = null

    const hoverInterval = setInterval(() => {
        // get cursor position and element under it
        const cursorPosition = cursorElement.getBoundingClientRect()
        const elementMouseIsOver = document.elementFromPoint(cursorPosition.x, cursorPosition.y)

        // do nothing if cursor moves over same element as before
        if (lastElement === elementMouseIsOver) {
            return
        }

        // turn off onHover effect on previous element (if any)
        if (lastElement) {
            lastElement.classList.remove(hoverClass)
        }

        // turn on onHover effect on current element (if any)
        if (elementMouseIsOver !== null) {
            elementMouseIsOver.classList.add(hoverClass)
        }

        // remember element with active onHover effect
        lastElement = elementMouseIsOver
    }, interval)

    // create interval clear trigger
    const clearEffect = () => clearInterval(hoverInterval)

    return clearEffect
}
