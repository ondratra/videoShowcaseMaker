import {IAsyncAction} from '../../src/tools/interfaces'

import {IPluginAppliance, IPluginConvience, IShowcaseMakerPlugin} from '../../src/tools/plugin'

// TODO: move definition to different file
import {
    AppliancesType,
    DefaultsType,
    executePlan as executePlanCore,
    IVideoPlan,
    ITMPActionsSettings,
    tmpBlinder
} from '../../src/flows/executePlan'
import {mergeAppliancesCallables} from '../../src/flows/utils'
import * as tools from '../../src/tools'
import {RecordToValuesUnion, UnionToIntersection, SimpleFlatten} from '../../src/tools/typeUtils'

export const selectors = {
    exampleButton1: '#exampleButton1'
}


export function getPlugins() {
    const plugins = [
        tools.core,
        tools.cursor,
    ] as const

    type SetupAllArray<T extends typeof plugins> = {[K in keyof T]: T[K]['setupAll'] }

    //const pluginSetups = plugins as unknown as SetupAllArray<typeof plugins> // TODO: try to get rid of `unknown` (tuple typings problem here)
    const pluginSetups = plugins.map(item => item.setupAll) as unknown as SetupAllArray<typeof plugins> satisfies readonly (IShowcaseMakerPlugin<tmpBlinder>)[] // TODO: try to get rid of `unknown` (tuple typings problem here)
console.log('werq', pluginSetups)

    return pluginSetups
}

// TODO: use as minimal (extended) type for pluginList
//type NoPlugins = SetupAllArray<typeof {}>


type MyAppliances = AppliancesType<ReturnType<typeof getPlugins>>

// TODO: rename videoPlan to showcasePlan
export function videoPlan(actionSettings: ITMPActionsSettings<MyAppliances>): IAsyncAction {
    const defaults: DefaultsType<MyAppliances> = {
        duration: 1000,
        delayAfterClickEffect: 300,
        //clickEffectDuration: 1000,
    }

    const {actions, actionsConvience} = mergeAppliancesCallables(actionSettings.appliances, defaults)

    // conviences overwrite actions of the same name
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






