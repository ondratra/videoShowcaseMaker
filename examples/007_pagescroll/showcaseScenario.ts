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
    scrollToContainer1: '.scrollToContainer1',
    scrollToContainer2: '.scrollToContainer2',
}

export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),
        corePlugins.pageScroll.setupPlugin(),
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
    }

    const { primitives, composites, compositesIncludingEnhancements } = mergeAppliancesCallables(planSettings, defaults)

    // composites overwrite primitives of the same name
    // use `planSettings.appliances.myPlugin.primitives.myAction`
    // to get access to overwritten primitives (or composites)
    const actions = { ...primitives, ...composites, ...compositesIncludingEnhancements }

    return actions.asyncSequence([
        actions.pageScrollToElement(selectors.scrollToContainer1),
        actions.delay(),
        actions.pageScrollToElement(selectors.scrollToContainer2),
        actions.delay(),
        actions.pageScrollTo(100),
        actions.delay(),
    ])
}
