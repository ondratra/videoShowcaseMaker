import {IActionsSettings} from '../../src/actions/interfaces'
import {setupActions} from '../../src/actions/setupActions'
import {IAsyncAction, asyncSequence} from '../../src/tools/actions'

export const selectors = {
    exampleButton1: '#exampleButton1'
}

export function videoPlan(actionSettings: IActionsSettings): IAsyncAction {
    const {actions/*, sequences, resources*/} = setupActions(actionSettings)

    return asyncSequence([
        // click example button
        actions.moveCursorToElement(selectors.exampleButton1),
        actions.delay(),
        actions.clickElement(selectors.exampleButton1),
        actions.delay(),
    ])
}
