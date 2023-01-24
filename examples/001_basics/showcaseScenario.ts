import {
    corePlugins,
    DefaultsType,
    IAsyncAction,
    IVideoPlanParameters,
    mergeAppliancesCallables,
    ReadonlyPluginsBase,
} from '../../src'

export const selectors = {
    exampleButton1: '#exampleButton1',
}

export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),
        corePlugins.audio.setupPlugin(),
        corePlugins.cursor.setupPlugin({ clickEffectDuration: 4000 }),
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

    const { primitives, composites } = mergeAppliancesCallables(actionSettings.appliances, defaults)

    // composites overwrite primitives of the same name
    // use `actionSettings.appliances.myPlugin.primitives.myAction`
    // to get access to overwritten primitives (or composites)
    const actions = { ...primitives, ...composites }

    return actions.asyncSequence([
        // click example button
        actions.moveCursorToElement(selectors.exampleButton1),
        actions.clickElement(selectors.exampleButton1),
        actions.delay(),

        // ultimate test of typeguards
        //actions.shouldThrowError(), // this should trigger compile-time error
    ])
}
