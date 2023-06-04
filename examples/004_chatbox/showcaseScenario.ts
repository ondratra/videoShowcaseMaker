import {
    corePlugins,
    DefaultsType,
    IAsyncAction,
    IShowcasePlanParameters,
    mergeAppliancesCallables,
    ReadonlyPluginsBase,
} from '../../src'

// declare all CSS selectors that will be used by showcase plan
const selectors = {
    // TODO: expose selectors by plugins together with plugin's elements
    //       each overlay will need to be targetable separately for it to work properly
    //       currently when multiple overlays of the same plugins are present you can't select specific one of them
    chatbox: {
        textInput: '#showcaseOverlay_chatbox .chatTextInput',
        sendButton: '#showcaseOverlay_chatbox .sendIcon',
    },
}

// declare all message that we will want to display in chatbox
const chatTexts = {
    bob: {
        hello: 'Hello Alice!',
    },
    alice: {
        hello: 'Hi Bob :-)',
        goodbye: "I'm really looking forward to seeing you next week. Bye",
    },
}

export function getPlugins() {
    const plugins = [
        corePlugins.core.setupPlugin(),

        // audio plugin for clicking cursor sound
        corePlugins.audio.setupPlugin(),

        // text plugin for write into text inputs visual effects
        corePlugins.text.setupPlugin(),

        // chatbox plugin
        corePlugins.chatbox.setupPlugin(corePlugins.chatbox.recommendedConfiguration),

        // cursor plugin for clicking cursor
        corePlugins.cursor.setupPlugin(corePlugins.cursor.recommendedConfiguration),
    ] as const satisfies ReadonlyPluginsBase

    return plugins
}

// infer TS type for declared plugins
type PluginsType = ReturnType<typeof getPlugins>

/**
 * Showcase plan that demonstrates basic features. Core, Audio, and Cursor plugins are presented.
 */
export function showcasePlan(planSettings: IShowcasePlanParameters<PluginsType>): IAsyncAction {
    const defaults: DefaultsType<PluginsType> = {
        ...corePlugins.core.recommendedDefaults,
        ...corePlugins.audio.recommendedDefaults,
        ...corePlugins.cursor.recommendedDefaults,
        ...corePlugins.text.recommendedDefaults,
        ...corePlugins.chatbox.recommendedDefaults,

        clickSoundUrl: '../assets/click.ogg',
    }

    const { primitives, composites, compositesIncludingEnhancements } = mergeAppliancesCallables(planSettings, defaults)

    // composites overwrite primitives of the same name
    // use `planSettings.appliances.myPlugin.primitives.myAction`
    // to get access to overwritten primitives (or composites)
    const actions = { ...primitives, ...composites, ...compositesIncludingEnhancements }

    // TODO: hover over send-message button is not triggered for virtual cursor - setup of hover effect needs to support
    //       other plugins - currently it supports only css defined (or imported) in html file
    const writeAndSendText = (text: string) =>
        actions.asyncSequence([
            actions.moveCursorToElement(selectors.chatbox.textInput),
            actions.clickElement(selectors.chatbox.textInput),
            actions.delay(),
            actions.writeIntoInput(selectors.chatbox.textInput, text),
            actions.delay(),
            actions.moveCursorToElement(selectors.chatbox.sendButton),
            actions.delay(),
            actions.clickEffectOnly(),
            actions.chatSendMessageFromInput(),
            actions.delay(),
        ])

    return actions.asyncSequence([
        actions.showChatbox(),

        writeAndSendText(chatTexts.bob.hello),

        actions.delay(),
        actions.chatCounterparty(chatTexts.alice.hello),

        // chat parties POV switch
        actions.delay(),
        actions.hideChatbox(),
        actions.delay(),
        actions.chatSwitchParties(),
        actions.delay(),
        actions.showChatbox(),

        writeAndSendText(chatTexts.alice.goodbye),

        actions.delay(5000),
    ])
}
