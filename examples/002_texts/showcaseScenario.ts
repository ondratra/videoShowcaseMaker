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
    loremIpsumContainer: '.loremIpsumContainer',
}

// declare all plugins that will be used by showcase plan
export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),

        // TODO: try to remove these after optional dependencies are supported
        corePlugins.audio.setupPlugin(),
        corePlugins.cursor.setupPlugin({ clickEffectDuration: 4000 }),

        corePlugins.text.setupPlugin(),
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
        ...corePlugins.text.recommendedDefaults,

        soundUrls: {
            click: '../assets/click.ogg',
            mouseDown: '../assets/mouseDown.ogg',
            mouseUp: '../assets/mouseUp.ogg',
        },
    }

    const { primitives, composites } = mergeAppliancesCallables(planSettings, defaults)

    // composites overwrite primitives of the same name
    // use `planSettings.appliances.myPlugin.primitives.myAction`
    // to get access to overwritten primitives (or composites)
    const actions = { ...primitives, ...composites }

    return actions.asyncSequence([
        // select text
        actions.selectElementText(selectors.loremIpsumContainer, 6, 20),
        actions.delay(),
    ])
}
