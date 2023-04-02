import { IPluginAppliance } from '../plugin'
import { ChatboxLogic, ChatCounterpartyGender, ChatParties } from './ChatboxLogic'
import { primitives as rawPrimitives } from './primitives'
import { IChatboxElements } from './setup'

// TODO: separate actions that can be interpreted as primitives

/**
 * Default values for Chatbox plugin composites.
 */
export interface IChatboxPluginDefaults {}

export const composites =
    (elements: IChatboxElements, _primitives: ReturnType<typeof rawPrimitives>) =>
    (_pluginsLoaded: Record<string, IPluginAppliance<unknown>>, _defaults: IChatboxPluginDefaults) => {
        const chatbox = new ChatboxLogic(elements)

        return {
            // chatbox
            showChatbox: () => () => {
                //chatbox.setParties(partyName, counterpartyName)
                //chatbox.setMessages([])
                const resultPromise = chatbox.showChatbox()

                return resultPromise
            },
            hideChatbox: () => () => chatbox.hideChatbox(),
            clearChatbox: () => async () => chatbox.setMessages([]),
            chatSendMessageFromInput: () => async () => chatbox.chatSendMessageFromInput(),
            chatParty: (text: string) => () => {
                chatbox.addMessage({
                    party: ChatParties.party,
                    text,
                })
                return Promise.resolve()
            },
            chatSwitchParties: () => async () => chatbox.chatSwitchParties(),
            chatCounterparty: (text: string) => () => {
                chatbox.addMessage({
                    party: ChatParties.counterparty,
                    text,
                })
                return Promise.resolve()
            },
            chatSetCounterparty: (gender: ChatCounterpartyGender, name: string) => async () =>
                chatbox.setCounterparty(gender, name),
        }
    }
