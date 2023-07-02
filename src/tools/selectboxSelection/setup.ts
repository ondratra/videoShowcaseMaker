import { IPluginElements } from '../plugin'
import { createOverlay } from '../utils'

export interface ISelectboxSelectionElements extends IPluginElements {
    selectionContainer: HTMLElement
    optionTemplate: HTMLElement
    overlayElement: HTMLElement

    currentSelectbox: HTMLSelectElement | null
}

export function createSelectboxSelectionElements(): ISelectboxSelectionElements {
    const selectionContainer = document.createElement('div')
    selectionContainer.classList.add('selectboxSelectionContainer')
    //textContainer.style.fontSize = '50px'
    selectionContainer.style.position = 'absolute'
    selectionContainer.style.border = '1px solid #ddd'
    selectionContainer.style.visibility = 'hidden'

    const optionTemplate = document.createElement('div')
    optionTemplate.style.display = 'flex'
    optionTemplate.style.height = '34px'
    optionTemplate.style.padding = '6px 20px'
    optionTemplate.style.backgroundColor = '#fff'

    const overlayElement = createOverlay('selectboxSelection')

    overlayElement.appendChild(selectionContainer)

    return {
        selectionContainer,
        optionTemplate,
        overlayElement,

        currentSelectbox: null,
    }
}
