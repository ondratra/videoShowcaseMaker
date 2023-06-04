import { IChatboxElements } from './setup'

// TODO: rewrite - at least split gui actions from abstract actions (see addMessage/setMessatges for weird logic mixup)

export enum ChatPartyTypes {
    party,
    counterparty,
}

export enum ChatCounterpartyGender {
    male,
    female,
}

export interface IChatboxMessage {
    party: ChatPartyTypes
    text: string
}

export interface ChatParty {
    gender: ChatCounterpartyGender
    name: string
}

export class ChatboxLogic {
    private messages: IChatboxMessage[] = []
    private chatElements: IChatboxElements

    // non-null assertation here is needed until https://github.com/microsoft/TypeScript/issues/30462 is solved
    private party!: ChatParty
    private counterparty!: ChatParty

    public constructor(chatElements: IChatboxElements, party: ChatParty, counterparty: ChatParty) {
        this.chatElements = chatElements
        this.setParty(party)
        this.setCounterparty(counterparty)
    }

    public setCounterparty(chatParty: ChatParty): void {
        this.counterparty = chatParty

        this.chatElements.counterpartyNameElement.innerText = chatParty.name

        this.chatElements.counterpartyIcon.male.style.visibility =
            chatParty.gender == ChatCounterpartyGender.male ? 'visible' : 'hidden'
        this.chatElements.counterpartyIcon.female.style.visibility =
            chatParty.gender == ChatCounterpartyGender.female ? 'visible' : 'hidden'
    }

    public setParty(chatParty: ChatParty): void {
        this.party = chatParty
    }

    public showChatbox(): Promise<void> {
        const resultPromise = new Promise<void>((resolve) =>
            this.chatElements.chatboxContainer.addEventListener('transitionend', () => resolve(), { once: true }),
        )

        this.chatElements.chatboxContainer.style.transform = 'translate(0, 0)'

        return resultPromise
    }

    public hideChatbox(): Promise<void> {
        const resultPromise = new Promise<void>((resolve) =>
            this.chatElements.chatboxContainer.addEventListener('transitionend', () => resolve(), { once: true }),
        )

        this.chatElements.chatboxContainer.style.transform = 'translate(0px, 100%)'

        return resultPromise
    }

    public chatSendMessageFromInput(): void {
        const text = this.chatElements.inputElement.value
        this.chatElements.inputElement.value = ''

        this.addMessage({
            party: ChatPartyTypes.party,
            text,
        })
    }

    public chatSwitchParties(): void {
        const messages = this.messages.map((item) => {
            return {
                ...item,
                party: item.party == ChatPartyTypes.party ? ChatPartyTypes.counterparty : ChatPartyTypes.party,
            }
        })

        this.setMessages(messages)

        const tmpCounterparty = this.counterparty
        this.setCounterparty(this.party)
        this.setParty(tmpCounterparty)
    }

    public setMessages(messages: IChatboxMessage[]): void {
        this.messages = []
        this.chatElements.messagesContainer.innerHTML = ''

        messages.forEach((item) => this.addMessage(item))
    }

    public addMessage(message: IChatboxMessage): number {
        this.messages.push(message)

        const messageElement = document.createElement('div')
        messageElement.classList.add('message')
        messageElement.classList.add(message.party == ChatPartyTypes.party ? 'party' : 'counterparty')
        messageElement.innerText = message.text

        this.chatElements.messagesContainer.appendChild(messageElement)

        const messageIndex = this.messages.length - 1

        return messageIndex
    }
}
