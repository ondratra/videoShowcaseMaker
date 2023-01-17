//import * as tools from '../tools'
//import {defaults} from './defaults'
import {createOverlay} from '../tools/utils'
import {asyncSequence} from '../tools/core/actions'
import {IAsyncAction} from '../tools/interfaces'
import {IShowcaseMakerPlugin, IPluginAppliance} from '../tools/plugin'
import {UnionToIntersection, RecordToValuesUnion} from '../tools/typeUtils'

// TODO: refactor everything here



export interface ITMPActionsSettings<Appliances> {
    appliances: Appliances
}
export interface IVideoPlan<Appliances> {
    (actionSettings: ITMPActionsSettings<Appliances>): IAsyncAction
}

// TODO: find a way to properly set this `Defaults` type
export type tmpBlinder = any



// internal types providing proper access to plugins

type MyApplianceType<PluginType extends () => Promise<IPluginAppliance<tmpBlinder>>> = Awaited<ReturnType<PluginType>>
type OrderedAppliances<T extends readonly IShowcaseMakerPlugin<tmpBlinder>[]> = { [Key in keyof T]: MyApplianceType<T[Key]>} & {name: string}[]
type ArrayToRecord<Array extends readonly any[], Key extends keyof Array[number] & (string | number)> = {
    [K in Array[number] as K[Key]]: K
}
type MySetupPluginsResult<T extends readonly IShowcaseMakerPlugin<tmpBlinder>[]> = {
    appliancesOrdered: OrderedAppliances<T>
    appliances: ArrayToRecord<OrderedAppliances<T>, 'name'>
}

export type AppliancesType<Plugins extends readonly (IShowcaseMakerPlugin<tmpBlinder>)[]> = ArrayToRecord<OrderedAppliances<Plugins>, 'name'>

export type DefaultsType<T extends AppliancesType<IShowcaseMakerPlugin<tmpBlinder>[]>> = UnionToIntersection<RecordToValuesUnion<{
    [K in keyof T]: Parameters<T[K]['convience']>[1]
}>>

export async function executePlan<
    Appliance extends AppliancesType<Plugins>,
    Plugins extends readonly (IShowcaseMakerPlugin<tmpBlinder>)[],
>(videoPlan: IVideoPlan<Appliance>, plugins: Plugins): Promise<void> {
    // setup plugins
    const {appliancesOrdered, appliances} = await setupPlugins(plugins)

    // append overlays to document
    const documentBody = document.querySelector('body') as HTMLBodyElement
    const videoContainer = createOverlay('videoContainer')

    const overlays = appliancesOrdered
        .map(item => item.elements.overlayElement)
        .filter(item => item) as HTMLElement[]
    overlays
        .forEach(item => videoContainer.appendChild(item))
    documentBody.appendChild(videoContainer)


    // setTimeout needed to workaround some video start issues
    const resultPromise = new Promise<void>((resolve) => {
        setTimeout(async () => {
            // execute plan
            //await videoPlan({appliances} as any)() // TODO: get rid of any
            await videoPlan({appliances} as any)() // TODO: get rid of any

            // clean everything plugins need
            asyncSequence(appliancesOrdered.map(item => item.destroy))

            // clean container
            videoContainer.remove()

console.log('cleaer')
            // finish
            resolve()
        }, 1)
    })

    await resultPromise
}

async function setupPlugins<Setups extends Plugins, Plugins extends readonly (IShowcaseMakerPlugin<tmpBlinder>)[]>(pluginsToSetup: Setups): Promise<MySetupPluginsResult<Setups>> {
    const appliancesOrdered = await Object.keys(pluginsToSetup).reduce(async (accPromise, key) => {
        const acc = await accPromise
        const plugin = pluginsToSetup[parseInt(key)]

        acc.push(await plugin())

        return acc
    }, Promise.resolve([]) as Promise<OrderedAppliances<Setups>>)

    const appliances = appliancesOrdered.reduce((acc, item, index) => {
        //(acc as Record<string, typeof item>)[item.name] = item // this underwhelming typecast is needed to fulfill type guards
        (acc as Record<string, typeof item>)[item.name] = item // this underwhelming typecast is needed to fulfill type guards

        return acc
    }, {} as ArrayToRecord<OrderedAppliances<Setups>, 'name'>)

    return {appliancesOrdered, appliances}
}
