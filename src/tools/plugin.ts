export type IShowcaseMakerPlugin = () => Promise<IPluginAppliance>

export type IPluginElements = Record<string, HTMLElement>
export type IPluginActions = Record<string, () => Promise<void>> // TODO: this needs upgrade
export type IPluginConvience = Record<string, (...args: unknown[]) => () => Promise<void>>

export interface IPluginAppliance {
    name: string
    requiredPlugins: string[] // TODO: ensure required plugins are present and already loaded
    elements: IPluginElements
    //actions: IPluginActions
    actions: any // TODO: improve
    //convience: (...args: unknown[]) => IPluginConvience // TODO: improve
    convience: any // TODO: improve
    destroy: () => Promise<void>
}

export interface IPluginConvienceParameters<Elements extends IPluginElements, Defaults> {
    //applianceElements: Elements
    documentBody: HTMLElement
    defaults: Defaults
}