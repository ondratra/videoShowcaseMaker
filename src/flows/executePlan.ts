import { asyncSequence } from '../tools/core/primitives'
import { IAsyncAction } from '../tools/plugin'
import { ArrayToRecord } from '../tools/typeUtils'
import { createOverlay } from '../tools/utils'
import { AppliancesType, MySetupPluginsResult, OrderedAppliances, PluginsBase, ReadonlyPluginsBase } from './utils'

/**
 * Showcase plan parameters.
 */
export interface IShowcasePlanParameters<Plugins extends PluginsBase> {
    appliances: AppliancesType<Plugins>
    appliancesOrdered: OrderedAppliances<Plugins>
}

/**
 * Showcase plan.
 */
export interface IShowcasePlan<Plugins extends PluginsBase> {
    (planSettings: IShowcasePlanParameters<Plugins>): IAsyncAction
}

/**
 * Executes showcase plan.
 */
export async function executePlan<Plugins extends PluginsBase>(
    showcasePlan: IShowcasePlan<Plugins>,
    plugins: Plugins,
): Promise<void> {
    // setup plugins
    const { appliancesOrdered, appliances } = await setupPlugins(plugins)

    // append overlays to document
    const documentBody = document.querySelector('body') as HTMLBodyElement
    const showcaseContainer = createOverlay('showcaseContainer')

    const overlays = appliancesOrdered
        .map((item) => item.elements.overlayElement)
        .filter((item) => item) as HTMLElement[]
    overlays.forEach((item) => showcaseContainer.appendChild(item))
    documentBody.appendChild(showcaseContainer)

    // setTimeout needed to workaround some showcase start issues
    const resultPromise = new Promise<void>((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
            // execute plan
            await showcasePlan({ appliancesOrdered, appliances })()

            // clean everything plugins need
            await asyncSequence(appliancesOrdered.map((item) => item.destroy))()

            // clean container
            showcaseContainer.remove()

            // finish
            resolve()
        }, 1)
    })

    await resultPromise
}

/**
 * Sequentially setups all plugins.
 */
async function setupPlugins<Plugins extends ReadonlyPluginsBase>(
    pluginsToSetup: Plugins,
): Promise<MySetupPluginsResult<Plugins>> {
    // TODO: explore posibilities to add type check for `requiredPlugins`
    //       that ensures all required plugins are present in appliances
    //       BEFORE plugin that requires it
    //
    //       such typeguard will need more research and will likely take
    //       quite time to implement - working with tuple types is still
    //       not ideal in typescript
    //
    //       this likely can't be done before this issue is fixed
    //       https://github.com/microsoft/TypeScript/issues/27995
    //
    // EDIT: it is likely achievalble since similar feature was needed for enhancements to work
    //       but let's leave the implemntation for another time
    function detectMissingRequiredPlugins(
        loadedPlugins: OrderedAppliances<Plugins>,
        requiredPlugins: readonly string[],
    ): string[] {
        return requiredPlugins.reduce(
            (acc, requiredPluginName) =>
                acc.concat(loadedPlugins.find((item) => item.name == requiredPluginName) ? [] : [requiredPluginName]),
            [] as string[],
        )
    }

    // setup plugins and collect their appliances
    const appliancesOrdered = await Object.keys(pluginsToSetup).reduce(async (accPromise, key) => {
        const acc = await accPromise
        const plugin = pluginsToSetup[parseInt(key)]
        const appliance = await plugin()

        // ensure all required plugins are loaded
        const missingRequiredPlugins = detectMissingRequiredPlugins(acc, appliance.requiredPlugins)
        if (missingRequiredPlugins.length) {
            const tmpLoadedMsg = acc.map((item) => item.name).join(', ')
            const tmpMissingMsg = missingRequiredPlugins.join(', ')
            throw new Error(
                `Not all required plugins are loaded! Loaded: [${tmpLoadedMsg}]. Missing: [${tmpMissingMsg}]. Required by: "${appliance.name}"`,
            )
        }

        acc.push(appliance)

        return acc
        // due to some strange TS behaviour a ridiculous `& unknown[]` additions needs to be here for everything to work
    }, Promise.resolve([]) as Promise<OrderedAppliances<Plugins> & unknown[]>)

    // index appliances by their names
    const appliances = appliancesOrdered.reduce((acc, item) => {
        ;(acc as Record<string, typeof item>)[item.name] = item // this underwhelming typecast is needed to fulfill type guards

        return acc
    }, {} as ArrayToRecord<OrderedAppliances<Plugins>, 'name'>)

    return { appliancesOrdered, appliances }
}
