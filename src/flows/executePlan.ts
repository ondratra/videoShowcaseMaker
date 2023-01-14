import * as tools from '../tools'
import {defaults} from './defaults'
import {IActionsSettings} from '../actions/interfaces'

// TODO: refactor everything here

export interface IVideoPlan {
    (actionSettings: IActionsSettings): tools.actions.IAsyncAction
}

export function executePlan(videoPlan: IVideoPlan): Promise<void> {
    const documentBody = document.querySelector('body') as HTMLBodyElement
    const videoContainer = tools.utils.createOverlay('videoContainer')

    // init cursor
    const cursorElements = tools.cursor.createCursorElements()
    const runClickEffect = tools.cursor.setupClickEffect(cursorElements.clickEffectElement, defaults.clickEffectDuration)
    const clearHoverInterval = tools.cursor.setupHoverEffect(cursorElements)

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
    videoContainer.appendChild(cursorElements.overlayElement)
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
            cursorElements,
            runClickEffect,
            /*
            subtitlesElements,
            selectboxSelectionElements,
            chatboxElements,
            curtainElements,
            metamaskElements,
            clapboardElements,
            */
        }

        const settings: IActionsSettings = {
            videoElements,
            /*
            contractAddress,
            contractFactory
            */
        }

        setTimeout(async () => {
            // execute plan
            await videoPlan(settings)()

            // clean container
            videoContainer.remove()
            clearHoverInterval()

            // finish
            resolve()
        }, 1)
    })

    return resultPromise
}