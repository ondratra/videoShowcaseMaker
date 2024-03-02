import { IPluginAppliance, IPluginComposite, IPluginEnhancement } from '../tools/plugin'
import { FilterArray, MergeObjects, TupleIntersection, TupleReturnTypes } from '../tools/typeUtils'

// NOTE: This part of code is very hard to read, especially hard to edit or improve, and complicated due to existing
//       TypeScript's type system limitation. Features like higher order types and fully featured tuple types could
//       reduce amount of code and improve the readability in the future.
// TODO: list relevant TypeScript Github issues

// TODO: unite with UnknownDefaults defined in utils.ts
type UnknownDefaults = any

//type UnknownDefaults = any
type anyFunc = (...args: any[]) => any

// TODO: unite with RecordApplicances defined in utils.ts
// shared composites and primitives util types
type RecordAppliances = Record<string, IPluginAppliance<UnknownDefaults>>

/**
 * Bundled appliance's composites and loadable enhancements.
 */
type CompositesAndEnhancementCombination<
    T extends IPluginComposite<UnknownDefaults>,
    U extends IPluginEnhancement<UnknownDefaults>,
    LoadedPluginNames extends readonly any[],
> = {
    composites: T
    enhancements: ExtractCompositesFromEnhancements<U, LoadedPluginNames>
}

/**
 * Helper type that represents array of enhancements that can be loaded.
 */
type ExtractCompositesFromEnhancements<
    PluginEnhancements extends IPluginEnhancement<UnknownDefaults>,
    LoadedPluginNames extends readonly string[],
> = TupleReturnTypes<FilterArray<GetEnhancementsHelperPieces<PluginEnhancements, LoadedPluginNames>, anyFunc>>

/**
 * Helper type that extract composites from an enhancements that can be loaded.
 */
type GetEnhancementsHelperPieces<
    Enhancementsssss extends IPluginEnhancement<UnknownDefaults>,
    LoadedPluginNames extends readonly string[],
> = {
    [Key in keyof Enhancementsssss]: TupleIntersection<
        Enhancementsssss[Key]['requiredPlugins'],
        LoadedPluginNames
    > extends never
        ? []
        : Enhancementsssss[Key]['composites']
}

// prettier-ignore
/**
 * Walks through array of plugin appliances and combines all composites and loadable enhancements.
 */
type ExtractCompositesAndLoadableEnhancements<
    PluginsToBeLoaded extends readonly (keyof Appliances)[],
    LoadedPluginNames extends readonly (keyof Appliances)[],
    Appliances extends RecordAppliances,
    Result extends readonly any[] = [],
> = PluginsToBeLoaded extends []
    ? Result
    : PluginsToBeLoaded extends readonly [infer P0, ...infer Ps]
        ? P0 extends keyof Appliances
            ? Ps extends readonly (keyof Appliances)[]
                ? ExtractCompositesAndLoadableEnhancements<
                    Ps,
                    readonly [...LoadedPluginNames, P0],
                    Appliances,
                    readonly [
                        ...Result,
                        CompositesAndEnhancementCombination<
                            Appliances[P0]['composites'],
                            Appliances[P0]['enhancements'],
                            LoadedPluginNames
                        >,
                    ]
                 >
                : [] // 'this can never happen 1'
            : [] // 'this can never happen 2'
        : [] // 'this can never happen 3'

type MergedCompositesAndEnhancements = Record<string, any> // TODO -> connect to return type of `composites` func

/**
 * Composites and all enhancements belonging to single plugin appliance.
 */
// type ApplianceCompositesAndEnhancements = Pick<IPluginAppliance<UnknownDefaults>, 'composites' | 'enhancements'>
type ApplianceCompositesAndEnhancements = Record<string, any> // TODO - line above unfortunately doesn't work

// prettier-ignore
/**
 * Merged composites from loadable enhancement belonging to a single plugin appliance.
 */
type MergedEnhancementArrays<
    EnhancementArrays extends readonly ReturnType<IPluginComposite<UnknownDefaults>>[],
    Result = object,
> = EnhancementArrays extends any[]
    ? Result // line above this one may be usefull actually - mb even somehow 'replace' this one
    : EnhancementArrays extends readonly [infer P0, ...infer Ps]
        ? P0 extends ReturnType<IPluginComposite<UnknownDefaults>>
            ? Ps extends ReturnType<IPluginComposite<UnknownDefaults>>[]
                ? MergedEnhancementArrays<Ps, MergeObjects<Result, P0>>
                : 'this can never happen'
            : 'this can never happen'
        : 'this can never happen'

// prettier-ignore
/**
 * Combined composites and composites of loadable enhancements into single objects.
 */
type CombinedCompositesAndLoadableEnhancements<
    CompositesAndEnhancementsArray extends readonly ApplianceCompositesAndEnhancements[],
    Result extends MergedCompositesAndEnhancements = object,
> = CompositesAndEnhancementsArray extends []
    ? Result
    : CompositesAndEnhancementsArray extends readonly [infer P0, ...infer Ps]
        ? P0 extends ApplianceCompositesAndEnhancements
            ? Ps extends readonly ApplianceCompositesAndEnhancements[]
                ? CombinedCompositesAndLoadableEnhancements<
                    Ps,
                    MergeObjects<Result, MergedEnhancementArrays<P0['enhancements']>>
                >
                : 'this can never happen'
            : 'this can never happen'
        : 'this can never happen'

/**
 * Combines composites and enhancements from given appliances.
 */
export type EnhancedComposites<
    PluginsToBeLoaded extends readonly (keyof Appliances)[],
    Appliances extends RecordAppliances,
> = CombinedCompositesAndLoadableEnhancements<
    ExtractCompositesAndLoadableEnhancements<PluginsToBeLoaded, [], Appliances>
>
