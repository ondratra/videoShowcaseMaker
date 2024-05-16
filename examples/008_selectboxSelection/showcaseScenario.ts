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
    showcaseSelectbox: '#showcaseSelectbox',
}

export const selectboxTargetOptions = [1, 2]

export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),
        corePlugins.cursor.setupPlugin(corePlugins.cursor.recommendedConfiguration),
        corePlugins.selectboxSelection.setupPlugin(),
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
        ...corePlugins.cursor.recommendedDefaults,

        // TODO: remove this after enhancements are optional (sounds are not used in this example)
        soundUrls: {
            click: '../assets/click.ogg',
            mouseDown: '../assets/mouseDown.ogg',
            mouseUp: '../assets/mouseUp.ogg',
        },
    }

    const { primitives, composites, compositesIncludingEnhancements } = mergeAppliancesCallables(planSettings, defaults)

    // composites overwrite primitives of the same name
    // use `planSettings.appliances.myPlugin.primitives.myAction`
    // to get access to overwritten primitives (or composites)
    const actions = { ...primitives, ...composites, ...compositesIncludingEnhancements }

    return actions.asyncSequence([
        actions.showSelectboxSelection(selectors.showcaseSelectbox),
        actions.delay(),
        actions.hideSelectboxSelection(selectboxTargetOptions[0]),
        actions.delay(),
        actions.cursorMoveSelectboxSelection(selectors.showcaseSelectbox, selectboxTargetOptions[1]),
        actions.delay(),
    ])
}
