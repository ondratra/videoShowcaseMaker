import { ArrayMap, ArrayToRecord, SimpleFlattenObject } from '../../src/tools/typeUtils'
import { IPluginAppliance, IShowcaseMakerPlugin } from '../tools/plugin'
import { FilterEmptyProperties, RecordValuesToUnion, UnionToIntersection } from '../tools/typeUtils'
import { EnhancedComposites } from './enhancementUtils'

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
type CompositesTypeRecord<Appliances extends RecordAppliances> = {
    [Key in keyof Composites<Appliances>]: ReturnType<Composites<Appliances>[Key]>
}
type CompositesType<Appliances extends RecordAppliances> = SimpleFlattenObject<CompositesTypeRecord<Appliances>>

// primitives util types
type Primitives<Appliances extends RecordAppliances> = { [Key in keyof Appliances]: Appliances[Key]['primitives'] }
type PrimitivesTypeRecord<Appliances extends RecordAppliances> = {
    [Key in keyof Primitives<Appliances>]: Primitives<Appliances>[Key]
}
type PrimitivesType<Appliances extends RecordAppliances> = SimpleFlattenObject<PrimitivesTypeRecord<Appliances>>

/**
 * Extracts all composites from given appliances.
 */
function getAppliancesComposites<Appliances extends RecordAppliances>(
    appliances: Appliances,
    defaults: AppliancesDefaultsType<Appliances>,
) {
    type CompositesTypeTmp = CompositesType<Appliances>

    const composites = Object.keys(appliances).reduce<[CompositesTypeTmp, any]>(
        (acc: [CompositesTypeTmp, any], item) => {
            const applianceName = item as keyof Appliances

            const [composites, pluginsLoaded] = acc

            const newComposite = appliances[applianceName].composites(pluginsLoaded, defaults)

            return [
                { ...composites, ...newComposite },
                { ...pluginsLoaded, [applianceName]: appliances[applianceName] },
            ]
        },
        [{}, {}] as [CompositesTypeTmp, any],
    )[0]

    return composites
}

/**
 * Extracts all primitives from given appliances.
 */
function getAppliancesPrimitives<Appliances extends RecordAppliances>(appliances: Appliances) {
    type PrimitivesTypeTmp = PrimitivesType<Appliances>

    const primitives = Object.keys(appliances).reduce<[PrimitivesTypeTmp, any]>(
        (acc: [PrimitivesTypeTmp, any], item) => {
            const applianceName = item as keyof Appliances

            const [primitives, pluginsLoaded] = acc

            const newPrimitives = appliances[applianceName].primitives

            return [
                { ...primitives, ...newPrimitives },
                { ...pluginsLoaded, [applianceName]: appliances[applianceName] },
            ]
        },
        [{}, {}] as [PrimitivesTypeTmp, any],
    )[0]

    return primitives
}

function getAppliancesCompositesIncludingEnhancements<T extends ReadonlyPluginsBase>(
    setupPlugins: MySetupPluginsResult<T>,
    defaults: AppliancesDefaultsType<MySetupPluginsResult<T>['appliances']>,
): EnhancedComposites<ArrayMap<OrderedAppliances<T>, 'name'>, MySetupPluginsResult<T>['appliances']> {
    type Appliances = MySetupPluginsResult<T>['appliances']
    type CompositesWithEnhancementsTypeTmp = EnhancedComposites<
        ArrayMap<OrderedAppliances<T>, 'name'>,
        MySetupPluginsResult<T>['appliances']
    >

    function canEnhancementBeActivated(appliancesLoaded: Appliances, requiredPlugins: readonly string[]): boolean {
        //return requiredPlugins.reduce((acc, requiredPluginName) => acc && !!appliancesLoaded[requiredPluginName], true)
        return requiredPlugins.reduce(
            (acc, requiredPluginName: keyof Appliances) => acc && !!appliancesLoaded[requiredPluginName],
            true,
        )
    }

    const composites = setupPlugins.appliancesOrdered.reduce<[CompositesWithEnhancementsTypeTmp, any]>(
        (acc: [CompositesWithEnhancementsTypeTmp, any], item) => {
            const applianceName = item.name as keyof Appliances

            const [composites, appliancesLoaded] = acc

            const newComposites = item.composites(appliancesLoaded, defaults)
            const newEnhancements = item.enhancements
                .filter((item) => canEnhancementBeActivated(appliancesLoaded, item.requiredPlugins))
                .map((item) => item.composites(appliancesLoaded, defaults))
                .reduce((acc, item) => ({ ...acc, ...item }), {})

            const applianceExtended = {
                ...item,
                pluginActions: {
                    primitives: item.primitives,
                    composites: newComposites,
                    enhancements: newEnhancements,
                    actions: {
                        ...item.primitives,
                        ...newComposites,
                        ...newEnhancements,
                    },
                },
            }

            return [
                { ...composites, ...newComposites, ...newEnhancements },
                { ...appliancesLoaded, [applianceName]: applianceExtended },
            ]
        },
        [{}, {}] as [CompositesWithEnhancementsTypeTmp, any],
    )[0]

    return composites
}

/**
 * Merges primitives and composites of given appliances for easy access.
 */
export function mergeAppliancesCallables<T extends ReadonlyPluginsBase>(
    setupPlugins: MySetupPluginsResult<T>,
    defaults: AppliancesDefaultsType<MySetupPluginsResult<T>['appliances']>,
) {
    return {
        primitives: getAppliancesPrimitives(setupPlugins.appliances),
        composites: getAppliancesComposites(setupPlugins.appliances, defaults),
        compositesIncludingEnhancements: getAppliancesCompositesIncludingEnhancements(setupPlugins, defaults), // TODO: proper defaults
    }
}

/////////////////// internal types providing proper access to plugins //////////

type MyApplianceType<PluginType extends IShowcaseMakerPlugin<UnknownDefaults>> = Awaited<ReturnType<PluginType>>

/**
 * Extract of sorted appliances of given plugins.
 */
export type OrderedAppliances<T extends ReadonlyPluginsBase> = { [Key in keyof T]: MyApplianceType<T[Key]> }

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
