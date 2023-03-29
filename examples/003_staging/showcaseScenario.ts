import {
    corePlugins,
    DefaultsType,
    IAsyncAction,
    IShowcasePlanParameters,
    mergeAppliancesCallables,
    ReadonlyPluginsBase,
    utils,
} from '../../src'

// declare all CSS selectors that will be used by showcase plan
export const selectors = {
    loremIpsumContainer1: '.loremIpsumContainer1',
    loremIpsumContainer2: '.loremIpsumContainer2',
}

// declare all plugins that will be used by showcase plan
export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),
        corePlugins.staging.setupPlugin(corePlugins.staging.recommendedConfiguration),
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
        ...corePlugins.staging.recommendedDefaults,
    }

    const { primitives, composites, compositesIncludingEnhancements } = mergeAppliancesCallables(planSettings, defaults)

    // composites overwrite primitives of the same name
    // use `planSettings.appliances.myPlugin.primitives.myAction`
    // to get access to overwritten primitives (or composites)
    const actions = { ...primitives, ...composites, ...compositesIncludingEnhancements }

    return actions.asyncSequence([
        // starting clapboard
        actions.clapboard(),
        actions.delay(),

        // fadein curtain
        actions.showCurtain(),

        // do everything needed behind scenes
        async () => {
            utils.findElement(selectors.loremIpsumContainer1).style.visibility = 'hidden'
            utils.findElement(selectors.loremIpsumContainer2).style.visibility = 'visible'
        },
        actions.delay(),

        // fadeout curtain
        actions.hideCurtain(),
        actions.delay(),

        // ending clapboard
        actions.clapboard(),
        actions.delay(),

        // reset state - this is only needed when running this example multiple times
        async () => {
            utils.findElement(selectors.loremIpsumContainer1).style.visibility = 'visible'
            utils.findElement(selectors.loremIpsumContainer2).style.visibility = 'hidden'
        },
    ])
}
