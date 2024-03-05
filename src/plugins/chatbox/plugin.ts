import { emptyPlugin, IPluginAppliance } from '../../tools/plugin'
import type { IChatboxPluginDefaults } from './composites'
//import { composites, IChatboxPluginDefaults } from './composites'
import { composites } from './composites'
import { primitives as rawPrimitives } from './primitives'
import * as setup from './setup'

/**
 * Recommended/example values for default values for Chatbox plugin.
 */
export const recommendedDefaults: IChatboxPluginDefaults = {}

/**
 * Recommended/example configuration for Chatbox plugin.
 */
export const recommendedConfiguration: setup.IConfiguration = {
    chatboxSlideDuration: 1200,
}

/**
 * Chatbox plugin exposes utilities that are either essential for other plugins or common in a showcase plan building.
 */
export const setupPlugin = (configuration: setup.IConfiguration) => async () => {
    const elements = setup.createChatboxElements(configuration.chatboxSlideDuration)
    const primitives = rawPrimitives(elements, configuration)

    // TODO: add enhancements for audio plugin that plays sound on chatbox message send and recieve

    return {
        ...emptyPlugin,

        name: 'chatbox',
        elements,
        primitives,
        composites: composites(elements, primitives),
    } as const satisfies IPluginAppliance<IChatboxPluginDefaults>
}
