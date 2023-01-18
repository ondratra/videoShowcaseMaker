import {IPluginAppliance, IShowcaseMakerPlugin} from '../../src/tools/plugin'
import {tmpBlinder} from './executePlan'
import {ArrayToRecord, SimpleFlatten} from '../../src/tools/typeUtils'
import {FilterEmptyProperties, UnionToIntersection, RecordValuesToUnion} from '../tools/typeUtils'

type RecordAppliances = Record<string, IPluginAppliance<tmpBlinder>>

type Conviences<Appliances extends RecordAppliances> = {[Key in keyof Appliances]: Appliances[Key]['convience']}
type ConvienceActionsTypeRecord<Appliances extends RecordAppliances> = {[Key in keyof Conviences<Appliances>]: ReturnType<Conviences<Appliances>[Key]>}
type ConvienceActionsType<Appliances extends RecordAppliances> = SimpleFlatten<ConvienceActionsTypeRecord<Appliances>>

type Actions<Appliances extends RecordAppliances> = {[Key in keyof Appliances]: Appliances[Key]['actions']}
type ActionsTypeRecord<Appliances extends RecordAppliances> = {[Key in keyof Actions<Appliances>]: Actions<Appliances>[Key]}
type ActionsType<Appliances extends RecordAppliances> = SimpleFlatten<ActionsTypeRecord<Appliances>>

function getAppliancesActionsConvience<Appliances extends RecordAppliances>(appliances: Appliances, defaults: DefaultsType<Appliances>) {
    type ConvienceActionsTypeTmp = ConvienceActionsType<Appliances>

    const actionsConvience = Object.keys(appliances)
        .reduce<[ConvienceActionsTypeTmp, any]>((acc: [ConvienceActionsTypeTmp, any], item) => {
            const applianceName = item as keyof Appliances

            const [conviences, pluginsLoaded] = acc

            const newConvience = appliances[applianceName].convience(pluginsLoaded, defaults)

            return [
                {...conviences, ...newConvience},
                {...pluginsLoaded, [applianceName]: appliances[applianceName]},
            ]
        }, [{}, {}] as [ConvienceActionsTypeTmp, any])[0]

    return actionsConvience
}

function getAppliancesActions<Appliances extends RecordAppliances>(appliances: Appliances, defaults: DefaultsType<Appliances>) {
    type ActionsTypeTmp = ActionsType<Appliances>

    const actions = Object.keys(appliances)
        .reduce<[ActionsTypeTmp, any]>((acc: [ActionsTypeTmp, any], item) => {
            const applianceName = item as keyof Appliances

            const [conviences, pluginsLoaded] = acc

            const newConvience = appliances[applianceName].actions

            return [
                {...conviences, ...newConvience},
                {...pluginsLoaded, [applianceName]: appliances[applianceName]},
            ]
        }, [{}, {}] as [ActionsTypeTmp, any])[0]

    return actions
}

export function mergeAppliancesCallables<Appliances extends RecordAppliances>(appliances: Appliances, defaults: DefaultsType<Appliances>) {
    return {
        actions: getAppliancesActions(appliances, defaults),
        actionsConvience: getAppliancesActionsConvience(appliances, defaults),
    }
}



// internal types providing proper access to plugins

type MyApplianceType<PluginType extends () => Promise<IPluginAppliance<tmpBlinder>>> = Awaited<ReturnType<PluginType>>

export type OrderedAppliances<T extends readonly IShowcaseMakerPlugin<tmpBlinder>[]> = { [Key in keyof T]: MyApplianceType<T[Key]>} & {name: string}[]

export type MySetupPluginsResult<T extends readonly IShowcaseMakerPlugin<tmpBlinder>[]> = {
    appliancesOrdered: OrderedAppliances<T>
    appliances: ArrayToRecord<OrderedAppliances<T>, 'name'>
}

export type AppliancesType<Plugins extends readonly (IShowcaseMakerPlugin<tmpBlinder>)[]> = ArrayToRecord<OrderedAppliances<Plugins>, 'name'>

type ExtractConviences<T extends AppliancesType<IShowcaseMakerPlugin<tmpBlinder>[]>> = {
    [K in keyof T]: Parameters<T[K]['convience']>
}
type ExtractArrayNthElements<T extends Record<string, unknown[]>, N extends number> = {
    [K in keyof T]: T[K][N]
}

export type DefaultsType<T extends AppliancesType<IShowcaseMakerPlugin<tmpBlinder>[]>> = UnionToIntersection<
    RecordValuesToUnion<
        ExtractArrayNthElements<

        FilterEmptyProperties<
            ExtractConviences<T>, []
        >
        , 1>
    >
>