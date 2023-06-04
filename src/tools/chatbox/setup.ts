import { IPluginElements } from '../plugin'
import { createOverlay } from '../utils'
import { styles, template } from './template'

/**
 * Configuration for Chatbox plugin.
 */
export interface IConfiguration {
    chatboxSlideDuration: number
}

export interface IChatboxElements extends IPluginElements {
    chatboxContainer: HTMLElement
    counterpartyNameElement: HTMLElement
    messagesContainer: HTMLElement
    inputElement: HTMLInputElement
    sendButton: HTMLElement
    counterpartyIcon: {
        male: HTMLElement
        female: HTMLElement
    }
    overlayElement: HTMLElement
}

export function createChatboxElements(chatboxSlideDuration: number): IChatboxElements {
    const overlayElement = createOverlay('chatbox', template, styles)

    const chatboxContainer = overlayElement.children[0] as HTMLElement
    chatboxContainer.style.pointerEvents = 'auto'
    chatboxContainer.style.transform = 'translate(0px, 100%)'
    chatboxContainer.style.transitionDuration = chatboxSlideDuration + 'ms'

    const counterpartyNameElement = chatboxContainer.querySelector('.contact .name') as HTMLElement
    const messagesContainer = chatboxContainer.querySelector('.chatBody .messages') as HTMLElement
    const inputElement = chatboxContainer.querySelector('.chatTextInput') as HTMLInputElement
    const sendButton = chatboxContainer.querySelector('.sendIcon') as HTMLElement
    const maleIconElement = chatboxContainer.querySelector('.pic.male') as HTMLElement
    const femaleIconElement = chatboxContainer.querySelector('.pic.female') as HTMLElement

    overlayElement.appendChild(chatboxContainer)

    return {
        chatboxContainer,
        counterpartyNameElement,
        messagesContainer,
        inputElement,
        sendButton,
        counterpartyIcon: {
            male: maleIconElement,
            female: femaleIconElement,
        },
        overlayElement,
    }
}
