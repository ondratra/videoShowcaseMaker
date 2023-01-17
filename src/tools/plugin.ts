//export type IShowcaseMakerPlugin<Defaults> = () => Promise<IPluginAppliance<Defaults>>
export type IShowcaseMakerPlugin<Defaults> = () => Promise<IPluginAppliance<Defaults>>

export type IPluginElements = Record<string, HTMLElement> & {overlayElement?: HTMLElement}
//export type IPluginActions = Record<string, () => Promise<void>> // TODO: this needs upgrade
//export type IPluginActions = Record<string, (...args: unknown[]) => () => Promise<void>> // TODO: this needs upgrade
export type IPluginActions = Record<string, (...args: any[]) => () => Promise<void>> // TODO: this needs upgrade
//export type IPluginConvience = Record<string, (...args: unknown[]) => () => Promise<void>>
//export type IPluginConvience = Record<string, (...args: any[]) => () => Promise<void>>
export type IPluginConvience<ConvienceParameters extends any[]> = Record<string, (...args: ConvienceParameters) => () => Promise<void>>
//export type IPluginConvience<Defaults> = Record<string, (...args: any[]) => (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: Defaults) => Promise<void>>
//export type IPluginConvience = Record<string, (...args: any[]) => Promise<void>>

/*
export interface IPluginAppliance<Defaults> {
    name: string
    requiredPlugins: string[] // TODO: ensure required plugins are present and already loaded
    elements: IPluginElements
    actions: IPluginActions
    //actions: any // TODO: improve
    //convience: (...args: unknown[]) => IPluginConvience // TODO: improve
    //convience: (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: Defaults) => IPluginConvience // TODO: improve
    //convience: <TMP>(pluginsLoaded: Record<string, IPluginAppliance<TMP>>, defaults: Defaults) => IPluginConvience // TODO: improve
    //convience: <TMP>(pluginsLoaded: Record<string, IPluginAppliance<any>>, defaults: Defaults) => IPluginConvience // TODO: improve
    convience: <TMP extends any[]>(pluginsLoaded: Record<string, IPluginAppliance<any>>, defaults: Defaults) => IPluginConvience<TMP> // TODO: improve
    destroy: () => Promise<void>
}
*/
/*
export interface IPluginAppliance<Defaults> {
    name: string
    requiredPlugins: string[] // TODO: ensure required plugins are present and already loaded
    elements: IPluginElements
    actions: IPluginActions
    //actions: any // TODO: improve
    convience: (pluginsLoaded: Record<string, IPluginAppliance<any>>, defaults: Defaults) => any // TODO: improve
    destroy: () => Promise<void>
}
*/
export interface IPluginAppliance<Defaults> {
    name: string
    requiredPlugins: readonly string[] // TODO: ensure required plugins are present and already loaded
    elements: IPluginElements
    actions: IPluginActions
    //actions: any // TODO: improve
    convience: (pluginsLoaded: Record<string, IPluginAppliance<any>>, defaults: Defaults) => any // TODO: improve
    destroy: () => Promise<void>
}
/*
export interface IPluginConvienceParameters<Elements extends IPluginElements, Defaults> {
    //applianceElements: Elements
    documentBody: HTMLElement
    defaults: Defaults
}
*/
