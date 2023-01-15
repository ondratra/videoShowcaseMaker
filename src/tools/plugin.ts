export type IShowcaseMakerPlugin = () => Promise<IPluginAppliance>

export type IPluginElements = Record<string, HTMLElement>
export type IPluginActions = Record<string, () => Promise<void>>
export type IPluginConvience = Record<string, (...args: unknown[]) => () => Promise<void>>

export interface IPluginAppliance {
    name: string
    elements: IPluginElements
    actions: IPluginActions
    //convience: (...args: unknown[]) => IPluginConvience // TODO: improve
    convience: any // TODO: improve
    destroy: () => Promise<void>
}

export interface IPluginConvienceParameters<Elements extends IPluginElements, Defaults> {
    //applianceElements: Elements
    documentBody: HTMLElement
    defaults: Defaults
}