import { IChatboxElements } from './setup'

// TODO: rewrite - at least split gui actions from abstract actions (see addMessage/setMessatges for weird logic mixup)

export enum ChatParties {
    party,
    counterparty,
}

export enum ChatCounterpartyGender {
    male,
    female,
}

export interface IChatboxMessage {
    party: ChatParties
    text: string
}

export class ChatboxLogic {
    private messages: IChatboxMessage[] = []
    private chatElements: IChatboxElements

    public constructor(chatElements: IChatboxElements) {
        this.chatElements = chatElements
    }
    /*
    public setParties(partyName: string, counterpartyName: string) {
        //this.chatElements.
    }
*/
    public setCounterparty(gender: ChatCounterpartyGender, name: string): void {
        this.chatElements.counterpartyNameElement.innerText = name

        this.chatElements.counterpartyIcon.male.style.visibility =
            gender == ChatCounterpartyGender.male ? 'visible' : 'hidden'
        this.chatElements.counterpartyIcon.female.style.visibility =
            gender == ChatCounterpartyGender.female ? 'visible' : 'hidden'
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
            party: ChatParties.party,
            text,
        })
    }

    public chatSwitchParties(): void {
        const messages = this.messages.map((item) => {
            return {
                ...item,
                party: item.party == ChatParties.party ? ChatParties.counterparty : ChatParties.party,
            }
        })

        this.setMessages(messages)
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
        messageElement.classList.add(message.party == ChatParties.party ? 'party' : 'counterparty')
        messageElement.innerText = message.text

        this.chatElements.messagesContainer.appendChild(messageElement)

        const messageIndex = this.messages.length - 1

        return messageIndex
    }
}
