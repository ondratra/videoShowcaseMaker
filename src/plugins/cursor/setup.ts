import { IAction, IAsyncAction, IPluginElements } from '../../tools/plugin'
import { createOverlay } from '../../tools/utils'
import { IEventEmitterElementSelector, setupMoveEventEmitter } from './moveEmitter'

// internal constants
const moveEmitInterval = 50
const hoverInterval = 50

/**
 * Configuration for Cursor plugin.
 */
export interface IConfiguration {
    clickEffectDuration: number
}

/**
 * Creates overlay for a plugin that can insert it's HTML content into it. It will cover the whole screen.
 */
export interface ICursorElements extends IPluginElements {
    cursorContainer: HTMLElement
    cursorElement: HTMLElement
    clickEffectElement: HTMLElement
    overlayElement: HTMLElement

    setCursorToPointer: () => void
    setCursorToDrag: () => void

    startEmittingMoveEvents: (eventEmitterElementSelector: IEventEmitterElementSelector) => void
    stopEmittingMoveEvents: () => void
}

/**
 * Creates elements used by Cursor plugin.
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

    const iconsContainer = document.createElement('div')
    // cursor icon has to be in separate div, otherwise it can break hover effect
    // due to some Font Awesome div replacement (or something like that)
    const iconContainerPointer = document.createElement('div')
    const iconPointer = document.createElement('div')
    iconPointer.classList.add('fas')
    iconPointer.classList.add('fa-mouse-pointer')

    const iconContainerDrag = document.createElement('div')
    const iconDrag = document.createElement('div')
    iconDrag.classList.add('fas')
    iconDrag.classList.add('fa-arrows-up-down-left-right')
    iconContainerDrag.style.display = 'none'

    iconContainerPointer.appendChild(iconPointer)
    iconContainerDrag.appendChild(iconDrag)

    iconsContainer.appendChild(iconContainerPointer)
    iconsContainer.appendChild(iconContainerDrag)
    cursorElement.appendChild(iconsContainer)

    const setCursorToPointer = () => {
        iconContainerPointer.style.display = 'block'
        iconContainerDrag.style.display = 'none'
    }
    const setCursorToDrag = () => {
        iconContainerPointer.style.display = 'none'
        iconContainerDrag.style.display = 'block'
    }

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
    overlayElement.style.zIndex = '10'

    cursorContainer.appendChild(clickEffectElement)
    cursorContainer.appendChild(cursorElement)
    overlayElement.appendChild(cursorContainer)

    const { startEmittingMoveEvents, stopEmittingMoveEvents } = setupMoveEventEmitter(cursorElement, moveEmitInterval)

    return {
        cursorContainer,
        cursorElement,
        clickEffectElement,
        overlayElement,

        setCursorToPointer,
        setCursorToDrag,

        startEmittingMoveEvents,
        stopEmittingMoveEvents,
    }
}

/**
 * Setups mouse click audio & visual effect.
 */
export function setupClickEffect(clickEffectElement: HTMLElement, duration: number): IAsyncAction {
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
                { once: true },
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
export function setupHoverEffect(cursorElements: ICursorElements): IAction {
    const hoverClass = '__showcase_virtual_hover'

    // prepare styles for initial set of CSS rules
    prepareVirtualStyles(Array.prototype.slice.call(document.styleSheets), cursorElements.cursorContainer, hoverClass)

    // prepare interval that activates hover effect for element under the cursor
    const hoverIntervalClear = prepareHoverInterval(cursorElements, hoverInterval, hoverClass)
    // watch for any new styles added to page and create virtual CSS :hover for them
    const stylesWatchdogClear = setupStylesAddedWatchdog(cursorElements.cursorContainer, hoverClass)

    // clear hover effect
    const clearEffect = () => {
        hoverIntervalClear()
        stylesWatchdogClear()
    }

    return clearEffect
}

/**
 * Prepares and inserts to document a virtual CSS :hover style that reacts on hover of both real cursor
 * and virtual one set up by this plugin.
 */
function prepareVirtualStyles(styleSheets: CSSStyleSheet[], cursorContainer: HTMLElement, hoverClass: string) {
    // prepare CSS rules
    const rulesText = constructVirtualHoverStyleRules(styleSheets, hoverClass)

    // do nothing if no rules needs to be added
    if (!rulesText) {
        return
    }

    // insert virtual onHover styles to document
    const styleElement = document.createElement('style')
    styleElement.innerHTML = rulesText
    cursorContainer.appendChild(styleElement)
}

/**
 * Creates CSS rules mimicking hover effect for the virtual cursor.
 */
function constructVirtualHoverStyleRules(styleSheets: CSSStyleSheet[], hoverClass: string) {
    // filter elements with hover effect defined
    const filter = (item: CSSStyleRule) => !!item.selectorText && !!item.selectorText.match(/:hover/)
    const rules = getCssRules(styleSheets, filter)

    // prepare virtual onHover class for each element
    const rulesText = rules
        .map((item) => item.cssText)
        .map((item) => item.replace(':hover', '.' + hoverClass))
        .join('\n')

    return rulesText
}

/**
 * Finds and returns CSS rules selected by a callback from document's existing CSS rules.
 */
function getCssRules(styleSheets: CSSStyleSheet[], filter: (rule: CSSStyleRule) => boolean): CSSStyleRule[] {
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
function prepareHoverInterval(cursorElements: ICursorElements, interval: number, hoverClass: string) {
    // element with active onHover effect
    let lastElement: Element | null = null
    const clearMutationObserver: IAction = () => {}

    const hoverInterval = setInterval(() => {
        // get cursor position and element under it
        const cursorPosition = cursorElements.cursorElement.getBoundingClientRect()
        const elementMouseIsOver = document.elementFromPoint(cursorPosition.x, cursorPosition.y)
        const applyCursorStyles = () => applyCursorStyleFromElement(cursorElements, elementMouseIsOver)

        // do nothing if cursor moves over same element as before
        if (lastElement === elementMouseIsOver) {
            return
        }

        // turn off onHover effect on previous element (if any)
        if (lastElement) {
            lastElement.classList.remove(hoverClass)
            clearMutationObserver()
        }

        // turn on onHover effect on current element (if any)
        if (elementMouseIsOver !== null) {
            elementMouseIsOver.classList.add(hoverClass)
            setupElementMutationObserver(elementMouseIsOver, applyCursorStyles)
        }

        applyCursorStyles()

        // remember element with active onHover effect
        lastElement = elementMouseIsOver
    }, interval)

    // create interval clear trigger
    const clearEffect = () => {
        clearInterval(hoverInterval)
        clearMutationObserver()
    }

    return clearEffect
}

/**
 * Applies relevant cursor image to virtual cursor depending on effective css cursor style.
 */
function applyCursorStyleFromElement(cursorElements: ICursorElements, elementMouseIsOver: Element | null) {
    // retrieve active css-cursor
    const cssCursorType = elementMouseIsOver ? window.getComputedStyle(elementMouseIsOver).cursor : 'pointer'

    // css-cursor to curosr image conversion table
    const supportedCursors: Record<string, () => void> = {
        auto: cursorElements.setCursorToPointer,
        default: cursorElements.setCursorToPointer,
        pointer: cursorElements.setCursorToPointer,
        move: cursorElements.setCursorToDrag,
    }

    // set proper cursor image
    const enableSelectedCursor = supportedCursors[cssCursorType] || supportedCursors.pointer
    enableSelectedCursor()
}

/**
 * Prepares mechanism that apply css cursor style to virtual cursor.
 */
function setupElementMutationObserver(element: Element, onChange: IAction): IAction {
    // prepare mutation observer config
    const config = {
        attributes: true,
    }

    // prepare mutation callback
    const onMutationCallback = () => {
        onChange()
    }

    // create observer
    const observer = new MutationObserver(onMutationCallback)
    observer.observe(element, config)

    // create observer clear trigger
    const clear = () => {
        observer.disconnect()
    }

    return clear
}

/**
 * Watches for new <style> element additions and ensures that respective virtual hover CSS rules are created.
 */
function setupStylesAddedWatchdog(cursorContainer: HTMLElement, hoverClass: string) {
    // mutation observer callback
    function onStyleElementInserted(mutationsList: MutationRecord[], _observer: MutationObserver) {
        for (const mutation of mutationsList) {
            if (mutation.type != 'childList') {
                continue
            }

            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) {
                    return
                }

                const element = node as HTMLStyleElement

                const allSheets = Array.prototype.slice
                    .call(element.querySelectorAll('style'))
                    .concat(element.tagName.toLowerCase() != 'style' ? [element] : [])
                    .map((item) => item.sheet)
                    .filter((item) => item)

                prepareVirtualStyles(allSheets, cursorContainer, hoverClass)
            })
        }
    }

    // prepare observer config
    const config = {
        childList: true,
        subtree: true,
    }

    // create observer
    const observer = new MutationObserver(onStyleElementInserted)
    observer.observe(document.documentElement, config)

    // create observer clear trigger
    const clear = () => {
        observer.disconnect()
    }

    return clear
}
