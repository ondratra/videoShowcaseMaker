import {IActionsSettings} from '../../src/actions/interfaces'
import {setupActions} from '../../src/actions/setupActions'
import {IAsyncAction, asyncSequence} from '../../src/tools/actions'
import {IPluginAppliance, IPluginConvience} from '../../src/tools/plugin'

// TODO: move definition to different file
import {ITMPActionsSettings} from '../../src/flows/executePlan'

export const selectors = {
    exampleButton1: '#exampleButton1'
}


// TODO: rename videoPlan to showcasePlan
/*
export function videoPlan(actionSettings: IActionsSettings): IAsyncAction {
    //const {actions/*, sequences, resources* /} = setupActions(actionSettings)

    const {actions} = tmpSetupActions(actionSettings)

    return asyncSequence([
        // click example button
        actions.moveCursorToElement(selectors.exampleButton1),
        actions.delay(),
        actions.clickElement(selectors.exampleButton1),
        actions.delay(),
    ])
}


*/
export function videoPlan(actionSettings: ITMPActionsSettings): IAsyncAction {
    const defaults = {
        duration: 1000,
        clickEffectDuration: 1000,
    } // TODO: typeguard

    // TODO: move this somewhere else
    // NOTE: conviences can be merged like this only if they all have unique names
    //const actions = Object.keys(actionSettings.appliances).reduce((acc, item) => ({...acc, ...actionSettings.appliances[item].convience}), {} as IPluginConvience)
    //const actions = Object.keys(actionSettings.appliances).reduce((acc, item) => ({...acc, ...actionSettings.appliances[item].convience(defaults)}), {} as IPluginConvience)
    /*
    const actions = Object.keys(actionSettings.appliances).reduce((acc, item) => {
        console.log(actionSettings.appliances[item].convience)
        return {...acc, ...actionSettings.appliances[item].convience(defaults)}
    }, {} as IPluginConvience)
    */
    const actions = Object.keys(actionSettings.appliances)
        .reduce<[IPluginConvience, Record<string, IPluginAppliance>]>((acc, applianceName) => {
            const [conviences, pluginsLoaded] = acc

            const newConvience = actionSettings.appliances[applianceName].convience(pluginsLoaded, defaults)

            return [
                {...conviences, ...newConvience},
                {...pluginsLoaded, [applianceName]: actionSettings.appliances[applianceName]},
            ]
        }, [{}, {}])[0]

    console.log('actionSettings', actionSettings)
    console.log('actions', actions)

    return asyncSequence([
        // TODO: improve type of `actions`
        //       not you can use `actions.nonExistingAction()` and compiler won't complain

        // click example button
        actions.moveCursorToElement(selectors.exampleButton1),
        actions.clickElement(selectors.exampleButton1),
        actions.delay(),
    ])
}


