import {createOverlay} from '../tools/utils'
import {asyncSequence} from '../tools/core/actions'
import {IAsyncAction} from '../tools/plugin'
import {ArrayToRecord, FilterEmptyProperties, UnionToIntersection} from '../tools/typeUtils'
import {AppliancesType, MySetupPluginsResult, OrderedAppliances, ReadonlyTmpPlugins, TmpPlugins} from './utils'

export interface IVideoPlanParameters<Appliances> {
    appliances: Appliances
}

export interface IVideoPlan<Appliances> {
    (actionSettings: IVideoPlanParameters<Appliances>): IAsyncAction
}

export async function executePlan<
    Appliance extends AppliancesType<Plugins>,
    Plugins extends TmpPlugins,
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

async function setupPlugins<Setups extends Plugins, Plugins extends ReadonlyTmpPlugins>(pluginsToSetup: Setups): Promise<MySetupPluginsResult<Setups>> {
    // TODO: explore posibilities to add type check for `requiredPlugins`
    //       that ensures all required plugins are present in appliances
    //       BEFORE plugin that requires it
    //
    //       such typeguard will need more research and will likely take
    //       quite time to implement
    function detectMissingRequiredPlugins(loadedPlugins: OrderedAppliances<Setups>, requiredPlugins: readonly string[]): string[] {
        return requiredPlugins.reduce((acc, requiredPluginName) => acc.concat(
            loadedPlugins.find(item => item.name == requiredPluginName)
                ? []
                : [requiredPluginName]
        ), [] as string[])
    }

    const appliancesOrdered = await Object.keys(pluginsToSetup).reduce(async (accPromise, key) => {
        const acc = await accPromise
        const plugin = pluginsToSetup[parseInt(key)]
        const appliance = await plugin()

        const missingRequiredPlugins = detectMissingRequiredPlugins(acc, appliance.requiredPlugins)
        if (missingRequiredPlugins.length) {
            const tmpLoadedMsg = acc.map(item => item.name).join(', ')
            const tmpMissingMsg = missingRequiredPlugins.join(', ')
            throw new Error(`Not all required plugins are loaded! Loaded: [${tmpLoadedMsg}]. Missing: [${tmpMissingMsg}]. Required by: "${appliance.name}"`)
        }

        acc.push(appliance)

        return acc
    }, Promise.resolve([]) as Promise<OrderedAppliances<Setups>>)

    const appliances = appliancesOrdered.reduce((acc, item, index) => {
        (acc as Record<string, typeof item>)[item.name] = item // this underwhelming typecast is needed to fulfill type guards

        return acc
    }, {} as ArrayToRecord<OrderedAppliances<Setups>, 'name'>)

    return {appliancesOrdered, appliances}
}
