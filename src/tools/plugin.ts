/**
 * Basal async action definition used by Showcase Maker.
 */
export type IAction = () => void

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
export type IPluginElements = Record<string, IPluginElement | null> & { overlayElement?: HTMLElement }
export type IPluginElement =
    | HTMLElement
    // TODO: consider separating this into different type (& object in plugin.ts)
    // TODO: `...args: unknown[]` doesn't work properly here -> I'm forced to use any[] here
    | ((...args: any[]) => void)
    | {
          [key: string]: IPluginElement
      }

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
    // TODO: improve enhancements type - atm defaults for all enhancements must be set even if you plan to use only one of them
    //       also enable disabling of unwanted enhancements
    enhancements: IPluginEnhancement<EnhancementsDefaults>
    utilities: Record<string, unknown> // TODO: try to transform this into useful interface
    destroy: IAsyncAction
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
    utilities: {},
    destroy: async () => {},
} as const satisfies Partial<IPluginAppliance<unknown, unknown>>
