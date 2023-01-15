import * as tools from '../tools'
import {defaults} from './defaults'
import {IActionsSettings} from '../actions/interfaces'
import {asyncSequence, IAsyncAction} from '../tools/actions'
import {IShowcaseMakerPlugin, IPluginAppliance} from '../tools/plugin'

// TODO: refactor everything here

/*
export interface IVideoPlan {
    (actionSettings: IActionsSettings): tools.actions.IAsyncAction
}

export async function executePlan(videoPlan: IVideoPlan): Promise<void> {
*/

// TODO: rename
export interface ITMPActionsSettings {
    appliances: Record<string, IPluginAppliance>
}

export interface IVideoPlan {
    //(actionSettings: IActionsSettings): tools.actions.IAsyncAction
    (actionSettings: ITMPActionsSettings): tools.actions.IAsyncAction
}

export function tmpPluginSetup() {
    const plugins = [
        tools.cursor,

/*
        {
            setupAll: async () => ({
                elements: {},
                actions: {},
                destroy: async () => {},
            })
        }
*/
    ].map(item => item.setupAll) satisfies IShowcaseMakerPlugin[]
}



export async function executePlan(videoPlan: IVideoPlan): Promise<void> {
    const documentBody = document.querySelector('body') as HTMLBodyElement
    const videoContainer = tools.utils.createOverlay('videoContainer')


    // TODO: load properly - likely move to IVideoPlan
    
    const plugins: IShowcaseMakerPlugin[] = [
        tools.cursor,
    ].map(item => item.setupAll)
    

    /*
    const plugins = [
        tools.cursor,

/*
        {
            setupAll: async () => ({
                elements: {},
                actions: {},
                destroy: async () => {},
            })
        }
* /
    ].map(item => item.setupAll) satisfies IShowcaseMakerPlugin[]
    */

/*
type aaaa = typeof plugins
type bbbb = ReturnType<aaaa[number]>
type cccc = Awaited<bbbb>
*/
/*
    const appliancesOrdered = await Object.keys(plugins).reduce(async (accPromise, key) => {
        const acc = await accPromise
        const plugin = plugins[parseInt(key)]

        acc.push(await plugin())

        return acc
    //}, Promise.resolve([] as IPluginAppliance[]))
    //}, Promise.resolve([] as typeof plugins))
    //}, Promise.resolve([] as Awaited<ReturnTypet<typeof plugins)[number]>>))
    //}, Promise.resolve([] as Awaited<bbbb>))
    //}, Promise.resolve([] as cccc[]))
    }, Promise.resolve([] as Awaited<ReturnType<(typeof plugins)[number]>>[]))

    const appliances = appliancesOrdered.reduce((acc, item, index) => {
        acc[item.name] = item

        return acc
    }, {} as Record<string, typeof appliancesOrdered[number]>)
*/

    const {appliancesOrdered, appliances} = await setupPlugins(plugins)
console.log(appliancesOrdered)
console.log(appliances)

    // TODO: remove this OLD CODE after everything has been moved from old repo

    //// init cursor
    //const cursorElements = tools.cursor.createCursorElements()
    //const runClickEffect = tools.cursor.setupClickEffect(cursorElements.clickEffectElement, defaults.clickEffectDuration)
    //const clearHoverInterval = tools.cursor.setupHoverEffect(cursorElements)

    /*
    // init subtitles
    const subtitlesElements = createSubtitlesElements()

    // init chatbox
    const chatboxElements = createChatboxElements()

    // init curtain
    const curtainElements = createCurtainElements()

    // init metamask illusion
    const metamaskElements = createMetamaskElements()

    // selectbox selection illusion
    const selectboxSelectionElements = createSelectboxSelectionElements()

    // clapboard
    const clapboardElements = createClapboardElements()

    // append elements to DOM - order matters
    // behind curtain
    videoContainer.appendChild(selectboxSelectionElements.overlayElement)
    videoContainer.appendChild(chatboxElements.overlayElement)
    videoContainer.appendChild(metamaskElements.overlayElement)
*/
    //videoContainer.appendChild(cursorElements.overlayElement)
//TODO: ensure appliances.cursor.elements is of type ICursorElements
    videoContainer.appendChild(appliances.cursor.elements.overlayElement)
/*
    // curtain
    videoContainer.appendChild(curtainElements.overlayElement)
    // in front of curtain
    videoContainer.appendChild(subtitlesElements.overlayElement)
    // in front of everything
    videoContainer.appendChild(clapboardElements.overlayElement)
*/
    documentBody.appendChild(videoContainer)


    // setTimeout needed to workaround some video start issues
    const resultPromise = new Promise<void>((resolve) => {
        const videoElements = {
            documentBody,

            // TODO: rework
            cursorElements: appliances.cursor.elements,
            runClickEffect: appliances.cursor.actions.runClickEffect,
            /*
            subtitlesElements,
            selectboxSelectionElements,
            chatboxElements,
            curtainElements,
            metamaskElements,
            clapboardElements,
            */
        }
/*
        const settings: IActionsSettings = {
            videoElements,


            /*
            contractAddress,
            contractFactory
            * /
        }
*/
        setTimeout(async () => {
            // execute plan
            //await videoPlan(settings)()
            await videoPlan({appliances})()


            // clean container
            videoContainer.remove()


            // clearHoverInterval()

            // clean everything plugins need
            asyncSequence(appliancesOrdered.map(item => item.destroy))




console.log('cleaer')
            // finish
            resolve()
        }, 1)
    })

    await resultPromise
}

// TODO: refactor + move to separate file or something like that
function tmpSetupActions(appliances: IPluginAppliance[]) {
    
}

async function setupPlugins(plugins: IShowcaseMakerPlugin[]) {
    const appliancesOrdered = await Object.keys(plugins).reduce(async (accPromise, key) => {
        const acc = await accPromise
        const plugin = plugins[parseInt(key)]

        acc.push(await plugin())

        return acc
    //}, Promise.resolve([] as IPluginAppliance[]))
    //}, Promise.resolve([] as typeof plugins))
    //}, Promise.resolve([] as Awaited<ReturnTypet<typeof plugins)[number]>>))
    //}, Promise.resolve([] as Awaited<bbbb>))
    //}, Promise.resolve([] as cccc[]))
    }, Promise.resolve([] as Awaited<ReturnType<(typeof plugins)[number]>>[]))

    const appliances = appliancesOrdered.reduce((acc, item, index) => {
        acc[item.name] = item

        return acc
    }, {} as Record<string, typeof appliancesOrdered[number]>)
console.log(appliancesOrdered)
console.log(appliances)

    return {appliancesOrdered, appliances}
}
