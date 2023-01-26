import { IPluginElements } from '../plugin'
import { createOverlay } from '../utils'

export interface IStagingElements extends IPluginElements {
    overlayElement: HTMLElement
    curtainOverlay: HTMLElement
    clapboardOverlay: HTMLElement
}

/**
 * Creates elements used by Staging plugin.
 */
export function createStagingElements(curtainFadeDuration: number): IStagingElements {
    const overlayElement = createOverlay('staging')

    const curtainOverlay = createCurtainOverlay(curtainFadeDuration)
    const clapboardOverlay = createClapboardOverlay()

    overlayElement.appendChild(curtainOverlay)
    overlayElement.appendChild(clapboardOverlay)

    return {
        overlayElement,
        curtainOverlay,
        clapboardOverlay,
    }
}

/**
 * Creates overlay for curtain.
 */
function createCurtainOverlay(curtainFadeDuration: number): HTMLElement {
    const overlayElement = createOverlay('curtain')

    overlayElement.style.transitionDuration = curtainFadeDuration + 'ms'
    overlayElement.style.opacity = '0'
    overlayElement.style.backgroundColor = '#fff'

    return overlayElement
}

/**
 * Creates overlay for clapboard.
 */
function createClapboardOverlay(): HTMLElement {
    const overlayElement = createOverlay('clapboard')

    overlayElement.style.visibility = 'hidden'
    overlayElement.style.backgroundColor = '#000'

    return overlayElement
}
