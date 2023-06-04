import {
    corePlugins,
    DefaultsType,
    IAsyncAction,
    IShowcasePlanParameters,
    mergeAppliancesCallables,
    ReadonlyPluginsBase,
} from '../../src'

// declare all CSS selectors that will be used by showcase plan
const selectors = {
    exampleButton1: '#exampleButton1',
}

// declare all plugins that will be used by showcase plan
export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),
        corePlugins.audio.setupPlugin(),
        corePlugins.cursor.setupPlugin(corePlugins.cursor.recommendedConfiguration),
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
        ...corePlugins.core.recommendedDefaults,
        ...corePlugins.audio.recommendedDefaults,
        ...corePlugins.cursor.recommendedDefaults,

        // TODO: upgrade how static resources are passed to showcase plan - maybe create new class for static assets
        //       or something like that
        clickSoundUrl: '../assets/click.ogg',
    }

    const { primitives, composites, compositesIncludingEnhancements } = mergeAppliancesCallables(planSettings, defaults)

    // composites overwrite primitives of the same name
    // use `planSettings.appliances.myPlugin.primitives.myAction`
    // to get access to overwritten primitives (or composites or enhancements)
    const actions = { ...primitives, ...composites, ...compositesIncludingEnhancements }

    console.log(actions)

    return actions.asyncSequence([
        // click example button
        actions.moveCursorToElement(selectors.exampleButton1),
        actions.clickElement(selectors.exampleButton1),
        actions.delay(),

        // ultimate test of typeguards
        //actions.shouldThrowError(), // this should trigger compile-time error

        actions.testingEnhancement(),
    ])
}
