import { findElement, IElementSelector } from '../utils'
import { ISelectboxSelectionElements } from './setup'

export const primitives = (elements: ISelectboxSelectionElements) => {
    return {
        showSelectboxSelection: (selectboxSelector: IElementSelector) =>
            showSelectboxSelection(elements, selectboxSelector),
        hideSelectboxSelection: (newOption?: number) => hideSelectboxSelection(elements, newOption),
    }
}

const showSelectboxSelection =
    (selectionElements: ISelectboxSelectionElements, selectboxSelector: IElementSelector) => async () => {
        const selectboxElement = findElement(selectboxSelector) as HTMLSelectElement

        selectionElements.selectionContainer.innerHTML = ''

        // create options
        const sourceOptions = selectboxElement.querySelectorAll('option')
        const options = Array.from(sourceOptions).reduce((acc, sourceOption) => {
            const newOption = selectionElements.optionTemplate.cloneNode() as HTMLOptionElement
            newOption.setAttribute('data-value', sourceOption.value)
            newOption.innerText = sourceOption.innerText

            const newAcc: HTMLOptionElement[] = acc.concat(newOption)

            return newAcc
        }, [] as HTMLOptionElement[])
        options.forEach((item) => selectionElements.selectionContainer.appendChild(item))

        // set reference to selectboxElement
        selectionElements.currentSelectbox = selectboxElement

        // setup position and show the selection
        const selectboxPosition = selectboxElement.getBoundingClientRect()

        selectionElements.selectionContainer.style.width = selectboxPosition.width + 'px'
        selectionElements.selectionContainer.style.left = selectboxPosition.x + 'px'
        selectionElements.selectionContainer.style.top = selectboxPosition.bottom + 'px'
        selectionElements.selectionContainer.style.visibility = 'visible'
    }

const hideSelectboxSelection = (selectionElements: ISelectboxSelectionElements, newOption?: number) => async () => {
    selectionElements.selectionContainer.style.visibility = 'hidden'

    if (typeof newOption == 'undefined') {
        return
    }

    const selectbox = selectionElements.currentSelectbox

    if (!selectbox) {
        return
    }

    const optionValue = selectbox.querySelectorAll('option')[newOption].value

    selectbox.value = optionValue
    selectbox.dispatchEvent(new Event('change'))
    selectbox.dispatchEvent(new Event('input'))
}
