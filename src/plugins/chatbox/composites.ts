import { IPluginAppliance } from '../../tools/plugin'
import { ChatboxLogic, ChatCounterpartyGender, ChatParty, ChatPartyTypes } from './ChatboxLogic'
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
        const party = {
            gender: ChatCounterpartyGender.male,
            name: 'Mr. Bob',
        }
        const counterparty = {
            gender: ChatCounterpartyGender.female,
            name: 'Mrs. Alice',
        }
        const chatbox = new ChatboxLogic(elements, party, counterparty)

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
                    party: ChatPartyTypes.party,
                    text,
                })
                return Promise.resolve()
            },
            chatSwitchParties: () => async () => chatbox.chatSwitchParties(),
            chatCounterparty: (text: string) => () => {
                chatbox.addMessage({
                    party: ChatPartyTypes.counterparty,
                    text,
                })
                return Promise.resolve()
            },
            chatSetCounterparty: (chatParty: ChatParty) => async () => chatbox.setCounterparty(chatParty),
        }
    }
