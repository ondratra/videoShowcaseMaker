import { IPluginElements } from '../../tools/plugin'
import { createOverlay } from '../../tools/utils'

const optionCssClassName = '__vsm_selectboxSelection_option'

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
    optionTemplate.classList.add(optionCssClassName)
    optionTemplate.style.display = 'flex'
    optionTemplate.style.height = '34px'
    optionTemplate.style.padding = '6px 20px'
    optionTemplate.style.pointerEvents = 'auto'

    const overlayElement = createOverlay('selectboxSelection')
    overlayElement.style.zIndex = '5'

    preparePseudoClassStyles(overlayElement)

    overlayElement.appendChild(selectionContainer)

    return {
        selectionContainer,
        optionTemplate,
        overlayElement,

        currentSelectbox: null,
    }
}

function preparePseudoClassStyles(overlayElement: HTMLElement) {
    // insert virtual onHover styles to document
    const styleElement = document.createElement('style')

    const content = `
        .${optionCssClassName} {
            background-color: #fff;
        }

        .${optionCssClassName}:hover {
            background-color: #ccc;
        }
    `

    styleElement.innerHTML = content
    overlayElement.appendChild(styleElement)
}
