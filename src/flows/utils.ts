import { IPluginAppliance, IShowcaseMakerPlugin } from '../../src/tools/plugin'
import { ArrayToRecord, SimpleFlatten } from '../../src/tools/typeUtils'
import { FilterEmptyProperties, RecordValuesToUnion, UnionToIntersection } from '../tools/typeUtils'

/////////////////// Aliases ////////////////////////////////////////////////////

// type representing unknown composites' default types
type UnknownDefaults = any

// plugin types (with unknown composites' default types)
export type PluginsBase = readonly IShowcaseMakerPlugin<UnknownDefaults>[]
export type ReadonlyPluginsBase = Readonly<PluginsBase>

/////////////////// mergeAppliancesCallables ///////////////////////////////////

// shared composites and primitives util types
type RecordAppliances = Record<string, IPluginAppliance<UnknownDefaults>>

// composites util types
type Composites<Appliances extends RecordAppliances> = { [Key in keyof Appliances]: Appliances[Key]['composites'] }
type CompositePrimitivesTypeRecord<Appliances extends RecordAppliances> = {
    [Key in keyof Composites<Appliances>]: ReturnType<Composites<Appliances>[Key]>
}
type CompositePrimitivesType<Appliances extends RecordAppliances> = SimpleFlatten<
    CompositePrimitivesTypeRecord<Appliances>
>

// primitives util types
type Primitives<Appliances extends RecordAppliances> = { [Key in keyof Appliances]: Appliances[Key]['primitives'] }
type PrimitivesTypeRecord<Appliances extends RecordAppliances> = {
    [Key in keyof Primitives<Appliances>]: Primitives<Appliances>[Key]
}
type PrimitivesType<Appliances extends RecordAppliances> = SimpleFlatten<PrimitivesTypeRecord<Appliances>>

/**
 * Extracts all composites from given appliances.
 */
function getAppliancesPrimitivesComposite<Appliances extends RecordAppliances>(
    appliances: Appliances,
    defaults: AppliancesDefaultsType<Appliances>,
) {
    type CompositePrimitivesTypeTmp = CompositePrimitivesType<Appliances>

    const primitivesComposite = Object.keys(appliances).reduce<[CompositePrimitivesTypeTmp, any]>(
        (acc: [CompositePrimitivesTypeTmp, any], item) => {
            const applianceName = item as keyof Appliances

            const [composites, pluginsLoaded] = acc

            const newComposite = appliances[applianceName].composites(pluginsLoaded, defaults)

            return [
                { ...composites, ...newComposite },
                { ...pluginsLoaded, [applianceName]: appliances[applianceName] },
            ]
        },
        [{}, {}] as [CompositePrimitivesTypeTmp, any],
    )[0]

    return primitivesComposite
}

/**
 * Extracts all primitives from given appliances.
 */
function getAppliancesPrimitives<Appliances extends RecordAppliances>(appliances: Appliances) {
    type PrimitivesTypeTmp = PrimitivesType<Appliances>

    const primitives = Object.keys(appliances).reduce<[PrimitivesTypeTmp, any]>(
        (acc: [PrimitivesTypeTmp, any], item) => {
            const applianceName = item as keyof Appliances

            const [composites, pluginsLoaded] = acc

            const newComposite = appliances[applianceName].primitives

            return [
                { ...composites, ...newComposite },
                { ...pluginsLoaded, [applianceName]: appliances[applianceName] },
            ]
        },
        [{}, {}] as [PrimitivesTypeTmp, any],
    )[0]

    return primitives
}

/**
 * Merges primitives and composites of given appliances for easy access.
 */
export function mergeAppliancesCallables<Appliances extends RecordAppliances>(
    appliances: Appliances,
    defaults: AppliancesDefaultsType<Appliances>,
) {
    return {
        primitives: getAppliancesPrimitives(appliances),
        composites: getAppliancesPrimitivesComposite(appliances, defaults),
    }
}

/////////////////// internal types providing proper access to plugins //////////

type MyApplianceType<PluginType extends IShowcaseMakerPlugin<UnknownDefaults>> = Awaited<ReturnType<PluginType>>

/**
 * Extract of sorted appliances of given plugins.
 */
export type OrderedAppliances<T extends ReadonlyPluginsBase> = { [Key in keyof T]: MyApplianceType<T[Key]> } & {
    name: string
}[]

/**
 * Extract of indexed appliances of given plugins.
 */
export type AppliancesType<Plugins extends ReadonlyPluginsBase> = ArrayToRecord<OrderedAppliances<Plugins>, 'name'>

/**
 * Extract of both sorted and indexed appliances from plugins.
 */
export type MySetupPluginsResult<T extends ReadonlyPluginsBase> = {
    appliancesOrdered: OrderedAppliances<T>
    appliances: AppliancesType<T>
}

type ExtractComposites<T extends AppliancesType<PluginsBase>> = {
    [K in keyof T]: Parameters<T[K]['composites']>
}
type ExtractArrayNthElements<T extends Record<string, unknown[]>, N extends number> = {
    [K in keyof T]: T[K][N]
}

/**
 * Extract of respective composites' default parameters for all given appliances.
 */
export type AppliancesDefaultsType<T extends AppliancesType<PluginsBase>> = UnionToIntersection<
    RecordValuesToUnion<ExtractArrayNthElements<FilterEmptyProperties<ExtractComposites<T>, []>, 1>>
>

/**
 * Extract of respective composites' default parameters for all given plugins.
 */
export type DefaultsType<T extends PluginsBase> = AppliancesDefaultsType<AppliancesType<T>>
