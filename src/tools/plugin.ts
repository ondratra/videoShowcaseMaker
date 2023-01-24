export type IAsyncAction = () => Promise<void>

export type IShowcaseMakerPlugin<Defaults> = () => Promise<IPluginAppliance<Defaults>>
export type IPluginElements = Record<string, HTMLElement> & { overlayElement?: HTMLElement }
export type IPluginActions = Record<string, (...args: any[]) => () => Promise<void>> // TODO: this needs upgrade
export type IPluginComposite<CompositeParameters extends any[]> = Record<
    string,
    (...args: CompositeParameters) => () => Promise<void>
>

export interface IPluginAppliance<Defaults> {
    name: string
    requiredPlugins: readonly string[]
    elements: IPluginElements
    primitives: IPluginActions
    composites: (pluginsLoaded: Record<string, IPluginAppliance<any>>, defaults: Defaults) => any // TODO: improve
    destroy: () => Promise<void>
}
