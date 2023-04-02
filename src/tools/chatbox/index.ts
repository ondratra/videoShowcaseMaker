import { IPluginAppliance } from '../plugin'
import { composites, IChatboxPluginDefaults } from './composites'
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
    chatboxSlideDuration: 500,
}

/**
 * Chatbox plugin exposes utilities that are either essential for other plugins or common in a showcase plan building.
 */
export const setupPlugin = (configuration: setup.IConfiguration) => async () => {
    const elements = setup.createChatboxElements(configuration.chatboxSlideDuration)
    const primitives = rawPrimitives(elements, configuration)

    return {
        name: 'chatbox',
        requiredPlugins: [],
        elements: {},
        primitives,
        composites: composites(elements, primitives),
        enhancements: [],
        destroy: async () => {},
    } as const satisfies IPluginAppliance<IChatboxPluginDefaults>
}
