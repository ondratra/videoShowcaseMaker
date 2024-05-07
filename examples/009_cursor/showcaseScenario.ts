import {
    corePlugins,
    DefaultsType,
    IAsyncAction,
    IShowcasePlanParameters,
    mergeAppliancesCallables,
    ReadonlyPluginsBase,
} from '../../src'
// } from '../../dist' // TODO: this will break types and will end in endless compilation; try to fix build system later on

// declare all CSS selectors that will be used by showcase plan
const selectors = {
    basicButton: '#basicButton',
    draggableButton: '#draggableButton',
    dragContainer: '#dragContainer',
    dragTarget: '#dragTarget',
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
        soundUrls: {
            click: '../assets/click.ogg',
            mouseDown: '../assets/mouseDown.ogg',
            mouseUp: '../assets/mouseUp.ogg',
        },
    }

    const { primitives, composites, compositesIncludingEnhancements } = mergeAppliancesCallables(planSettings, defaults)

    // composites overwrite primitives of the same name
    // use `planSettings.appliances.myPlugin.primitives.myAction`
    // to get access to overwritten primitives (or composites or enhancements)
    const actions = { ...primitives, ...composites, ...compositesIncludingEnhancements }

    return actions.asyncSequence([
        // click example button
        actions.moveCursorToElement(selectors.basicButton),
        actions.clickElement(selectors.basicButton),
        actions.delay(),

        // drag draggable button
        actions.moveCursorToElement(selectors.draggableButton),
        actions.mouseDown(selectors.draggableButton),
        actions.delay(),
        actions.moveCursorToElement(selectors.dragTarget),
        actions.delay(),
        actions.mouseUp(selectors.draggableButton),
        actions.delay(),
    ])
}
