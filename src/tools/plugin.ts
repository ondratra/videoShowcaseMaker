/**
 * Basal async action definition used by Showcase Maker.
 */
export type IAsyncAction = () => Promise<void>

/**
 * Showcase Maker plugin definition.
 */
export type IShowcaseMakerPlugin<Defaults> = () => Promise<IPluginAppliance<Defaults>>

/**
 * Elements created and exposed by the plugin.
 */
export type IPluginElements = Record<string, HTMLElement> & { overlayElement?: HTMLElement }

/**
 * Primitive actions exposed by the plugin.
 */
export type IPluginPrimitives = Record<string, (...args: any[]) => () => Promise<void>> // TODO: this needs upgrade

/**
 * Composite actions exposed by the plugin.
 */
export type IPluginComposite<Defaults> = (
    pluginsLoaded: Record<string, IPluginAppliance<any>>,
    defaults: Defaults,
) => any // TODO: improve

export type SingleEnhancementAppliance<EnhancementsDefaults> = {
    requiredPlugins: readonly string[]
    composites: IPluginComposite<EnhancementsDefaults>
    //composites: any // TODO: improve
}

export type IPluginEnhancement<EnhancementsDefaults> = readonly SingleEnhancementAppliance<EnhancementsDefaults>[]

/**
 * Appliance set up by the plugin. In other words, this is a type for a "plugin instance".
 */
export interface IPluginAppliance<Defaults, EnhancementsDefaults extends Defaults = Defaults> {
    name: string
    requiredPlugins: readonly string[]
    elements: IPluginElements
    primitives: IPluginPrimitives
    composites: IPluginComposite<Defaults>
    enhancements: IPluginEnhancement<EnhancementsDefaults>
    destroy: () => Promise<void>
}

/**
 * Plugin stub that can be used as a basis for an actual plugin.
 */
export const emptyPlugin = {
    requiredPlugins: [] as string[],
    elements: {},
    primitives: {},
    composites: () => ({}),
    enhancements: [],
    destroy: async () => {},
} as const satisfies Partial<IPluginAppliance<unknown, unknown>>
