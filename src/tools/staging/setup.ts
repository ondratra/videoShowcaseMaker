import { IPluginElements } from '../plugin'
import { createOverlay } from '../utils'

export interface IStagingElements extends IPluginElements {
    overlayElement: HTMLElement
    curtainOverlay: HTMLElement
    clapboardOverlay: HTMLElement
}

// TODO: handle properly as parameter
const curtainFadeDuration = 2000

export function createStagingElements(): IStagingElements {
    const overlayElement = createOverlay('staging')

    const curtainOverlay = createCurtainOverlay()
    const clapboardOverlay = createClapboardOverlay()

    overlayElement.appendChild(curtainOverlay)
    overlayElement.appendChild(clapboardOverlay)

    return {
        overlayElement,
        curtainOverlay,
        clapboardOverlay,
    }
}

function createCurtainOverlay(): HTMLElement {
    const overlayElement = createOverlay('curtain')

    overlayElement.style.transitionDuration = curtainFadeDuration + 'ms'
    overlayElement.style.opacity = '0'
    overlayElement.style.backgroundColor = '#fff'

    return overlayElement
}

function createClapboardOverlay(): HTMLElement {
    const overlayElement = createOverlay('clapboard')

    overlayElement.style.visibility = 'hidden'
    overlayElement.style.backgroundColor = '#000'

    return overlayElement
}
