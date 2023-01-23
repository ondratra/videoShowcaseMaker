import {
    corePlugins,
    mergeAppliancesCallables,
    DefaultsType,
    ReadonlyPluginsBase,
    IAsyncAction,
    IShowcaseMakerPlugin,
    IVideoPlan,
    IVideoPlanParameters,
} from '../../src'

export const selectors = {
    exampleButton1: '#exampleButton1'
}

export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),
        corePlugins.audio.setupPlugin(),
        corePlugins.cursor.setupPlugin({clickEffectDuration: 4000}),
    ] as const satisfies ReadonlyPluginsBase

    return plugins
}

type PluginsType = ReturnType<typeof getPlugins>

// TODO: rename videoPlan to showcasePlan
export function videoPlan(actionSettings: IVideoPlanParameters<PluginsType>): IAsyncAction {
    const defaults: DefaultsType<PluginsType> = {
        duration: 1000,
        delayAfterClickEffect: 300,
        clickSoundUrl: '../assets/click.ogg',
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
