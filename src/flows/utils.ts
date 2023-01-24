import { IPluginAppliance, IShowcaseMakerPlugin } from '../../src/tools/plugin'
import { ArrayToRecord, SimpleFlatten } from '../../src/tools/typeUtils'
import { FilterEmptyProperties, UnionToIntersection, RecordValuesToUnion } from '../tools/typeUtils'

/////////////////// Aliases ////////////////////////////////////////////////////

type UnknownDefaults = any

export type PluginsBase = readonly IShowcaseMakerPlugin<UnknownDefaults>[]
export type ReadonlyPluginsBase = Readonly<PluginsBase>

/////////////////// mergeAppliancesCallables ///////////////////////////////////

type RecordAppliances = Record<string, IPluginAppliance<UnknownDefaults>>

type Composites<Appliances extends RecordAppliances> = { [Key in keyof Appliances]: Appliances[Key]['composites'] }
type CompositeActionsTypeRecord<Appliances extends RecordAppliances> = {
    [Key in keyof Composites<Appliances>]: ReturnType<Composites<Appliances>[Key]>
}
type CompositeActionsType<Appliances extends RecordAppliances> = SimpleFlatten<CompositeActionsTypeRecord<Appliances>>

type Actions<Appliances extends RecordAppliances> = { [Key in keyof Appliances]: Appliances[Key]['primitives'] }
type ActionsTypeRecord<Appliances extends RecordAppliances> = {
    [Key in keyof Actions<Appliances>]: Actions<Appliances>[Key]
}
type ActionsType<Appliances extends RecordAppliances> = SimpleFlatten<ActionsTypeRecord<Appliances>>

function getAppliancesActionsComposite<Appliances extends RecordAppliances>(
    appliances: Appliances,
    defaults: AppliancesDefaultsType<Appliances>,
) {
    type CompositeActionsTypeTmp = CompositeActionsType<Appliances>

    const primitivesComposite = Object.keys(appliances).reduce<[CompositeActionsTypeTmp, any]>(
        (acc: [CompositeActionsTypeTmp, any], item) => {
            const applianceName = item as keyof Appliances

            const [composites, pluginsLoaded] = acc

            const newComposite = appliances[applianceName].composites(pluginsLoaded, defaults)

            return [
                { ...composites, ...newComposite },
                { ...pluginsLoaded, [applianceName]: appliances[applianceName] },
            ]
        },
        [{}, {}] as [CompositeActionsTypeTmp, any],
    )[0]

    return primitivesComposite
}

function getAppliancesActions<Appliances extends RecordAppliances>(appliances: Appliances) {
    type ActionsTypeTmp = ActionsType<Appliances>

    const primitives = Object.keys(appliances).reduce<[ActionsTypeTmp, any]>(
        (acc: [ActionsTypeTmp, any], item) => {
            const applianceName = item as keyof Appliances

            const [composites, pluginsLoaded] = acc

            const newComposite = appliances[applianceName].primitives

            return [
                { ...composites, ...newComposite },
                { ...pluginsLoaded, [applianceName]: appliances[applianceName] },
            ]
        },
        [{}, {}] as [ActionsTypeTmp, any],
    )[0]

    return primitives
}

export function mergeAppliancesCallables<Appliances extends RecordAppliances>(
    appliances: Appliances,
    defaults: AppliancesDefaultsType<Appliances>,
) {
    return {
        primitives: getAppliancesActions(appliances),
        composites: getAppliancesActionsComposite(appliances, defaults),
    }
}

/////////////////// internal types providing proper access to plugins //////////

type MyApplianceType<PluginType extends IShowcaseMakerPlugin<UnknownDefaults>> = Awaited<ReturnType<PluginType>>

export type OrderedAppliances<T extends ReadonlyPluginsBase> = { [Key in keyof T]: MyApplianceType<T[Key]> } & {
    name: string
}[]

export type MySetupPluginsResult<T extends ReadonlyPluginsBase> = {
    appliancesOrdered: OrderedAppliances<T>
    appliances: ArrayToRecord<OrderedAppliances<T>, 'name'>
}

export type AppliancesType<Plugins extends ReadonlyPluginsBase> = ArrayToRecord<OrderedAppliances<Plugins>, 'name'>

type ExtractComposites<T extends AppliancesType<PluginsBase>> = {
    [K in keyof T]: Parameters<T[K]['composites']>
}
type ExtractArrayNthElements<T extends Record<string, unknown[]>, N extends number> = {
    [K in keyof T]: T[K][N]
}

export type AppliancesDefaultsType<T extends AppliancesType<PluginsBase>> = UnionToIntersection<
    RecordValuesToUnion<ExtractArrayNthElements<FilterEmptyProperties<ExtractComposites<T>, []>, 1>>
>

export type DefaultsType<T extends PluginsBase> = AppliancesDefaultsType<AppliancesType<T>>
