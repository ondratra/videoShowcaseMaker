import {
    corePlugins,
    DefaultsType,
    IAsyncAction,
    IShowcasePlanParameters,
    mergeAppliancesCallables,
    ReadonlyPluginsBase,
} from '../../src'

// declare all CSS selectors that will be used by showcase plan
export const selectors = {
    exampleButton1: '#exampleButton1',
}

// declare all plugins that will be used by showcase plan
export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),
        corePlugins.audio.setupPlugin(),
        corePlugins.cursor.setupPlugin({ clickEffectDuration: 4000 }),
    ] as const satisfies ReadonlyPluginsBase

    return plugins
}

// infer TS type for declared plugins
type PluginsType = ReturnType<typeof getPlugins>

/**
 * Showcase plan that demonstrates basic features. Core, Audio, and Cursor plugins are presented.
 */
export function showcasePlan(planSettings: IShowcasePlanParameters<PluginsType>): IAsyncAction {
    const defaults: DefaultsType<PluginsType> = {
        duration: 1000,
        delayAfterClickEffect: 300,
        clickSoundUrl: '../assets/click.ogg',
    }

    const { primitives, composites } = mergeAppliancesCallables(planSettings.appliances, defaults)

    // composites overwrite primitives of the same name
    // use `planSettings.appliances.myPlugin.primitives.myAction`
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
