import {createOverlay} from '../tools/utils'
import {asyncSequence} from '../tools/core/primitives'
import {IAsyncAction} from '../tools/plugin'
import {ArrayToRecord} from '../tools/typeUtils'
import {AppliancesType, MySetupPluginsResult, OrderedAppliances, ReadonlyPluginsBase, PluginsBase} from './utils'

export interface IVideoPlanParameters<Plugins extends PluginsBase> {
    appliances: AppliancesType<Plugins>
}

export interface IVideoPlan<Plugins extends PluginsBase> {
    (primitiveSettings: IVideoPlanParameters<Plugins>): IAsyncAction
}

export async function executePlan<
    Plugins extends PluginsBase,
>(videoPlan: IVideoPlan<Plugins>, plugins: Plugins): Promise<void> {
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
            // execute plan
            await videoPlan({appliances})()

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

async function setupPlugins<Plugins extends ReadonlyPluginsBase>(pluginsToSetup: Plugins): Promise<MySetupPluginsResult<Plugins>> {
    // TODO: explore posibilities to add type check for `requiredPlugins`
    //       that ensures all required plugins are present in appliances
    //       BEFORE plugin that requires it
    //
    //       such typeguard will need more research and will likely take
    //       quite time to implement - working with tuple types is still
    //       not ideal in typescript
    function detectMissingRequiredPlugins(loadedPlugins: OrderedAppliances<Plugins>, requiredPlugins: readonly string[]): string[] {
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
    }, Promise.resolve([]) as Promise<OrderedAppliances<Plugins>>)

    const appliances = appliancesOrdered.reduce((acc, item) => {
        (acc as Record<string, typeof item>)[item.name] = item // this underwhelming typecast is needed to fulfill type guards

        return acc
    }, {} as ArrayToRecord<OrderedAppliances<Plugins>, 'name'>)

    return {appliancesOrdered, appliances}
}
