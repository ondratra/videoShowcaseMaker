import {IAsyncAction, IShowcaseMakerPlugin} from '../../src/tools/plugin'

import {
    IVideoPlan,
    IVideoPlanParameters,
    tmpBlinder
} from '../../src/flows/executePlan'
import {
    AppliancesType,
    DefaultsType,
} from '../../src/flows/utils'
import {mergeAppliancesCallables} from '../../src/flows/utils'
import * as tools from '../../src/tools'

export const selectors = {
    exampleButton1: '#exampleButton1'
}

export function getPlugins() {
    const plugins = [
        tools.core,
        tools.audio,
        tools.cursor,
    ] as const

    type SetupAllArray<T extends typeof plugins> = {[K in keyof T]: T[K]['setupAll'] }

    const pluginSetups = plugins.map(item => item.setupAll) as unknown as SetupAllArray<typeof plugins> satisfies readonly (IShowcaseMakerPlugin<tmpBlinder>)[] // TODO: try to get rid of `unknown` (tuple typings problem here)

    return pluginSetups
}

type MyAppliances = AppliancesType<ReturnType<typeof getPlugins>>

// TODO: rename videoPlan to showcasePlan
export function videoPlan(actionSettings: IVideoPlanParameters<MyAppliances>): IAsyncAction {
    const defaults: DefaultsType<MyAppliances> = {
        duration: 1000,
        delayAfterClickEffect: 300,
        //clickEffectDuration: 1000,
    }

    const {actions, actionsConvience} = mergeAppliancesCallables(actionSettings.appliances, defaults)

    // conviences overwrite actions of the same name
    // use `actionSettings.appliances.myPlugin.actions.myAction`
    // to get access to overwritten action (or actionsConvience)
    const tmpActions = {...actions, ...actionsConvience}

    return tmpActions.asyncSequence([
        // click example button
        tmpActions.moveCursorToElement(selectors.exampleButton1),
        tmpActions.clickElement(selectors.exampleButton1),
        tmpActions.delay(),


        // ultimate test of typeguards
        //tmpActions.shouldThrowError(), // this should trigger compile-time error
    ])
}






