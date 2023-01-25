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

/**
 * Appliance set up by the plugin. In other words, this is a type for a "plugin instance".
 */
export interface IPluginAppliance<Defaults> {
    name: string
    requiredPlugins: readonly string[]
    elements: IPluginElements
    primitives: IPluginPrimitives
    composites: IPluginComposite<Defaults>
    destroy: () => Promise<void>
}
