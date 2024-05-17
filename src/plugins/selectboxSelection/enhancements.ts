import { IPluginApplianceEnriched } from '../../tools/plugin'
import { IElementSelector } from '../../tools/utils'
import { asyncSequence } from '../core/primitives'
import { ICursorPluginDefaults } from '../cursor/composites' // TODO: expose this interface from cursor's index.ts (see TODOs below)
import { primitives as rawPrimitives } from './primitives'
import { ISelectboxSelectionElements } from './setup'
import { selectboxSelection } from './utilities'

//export interface SelectboxSelectionPluginEnhancementsDefaults {}
// TODO: improve this after enhancements are rewamped (enhancements are selectively enabled);
//       atm it is unclear if this interface should extend ICursorPluginDefaults, ICursorPluginEnhancementsDefaults, or both
export interface ISelectboxSelectionPluginEnhancementsDefaults extends ICursorPluginDefaults {}

export const enhancements =
    // TODO: make sure defaults are properly passed and used
    //(pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: ISelectboxSelectionPluginEnhancementsDefaults) => {
    (elements: ISelectboxSelectionElements, primitives: ReturnType<typeof rawPrimitives>) => {
        return [
            {
                requiredPlugins: ['cursor'],
                composites: (
                    pluginsLoaded: Record<string, IPluginApplianceEnriched<unknown>>,
                    defaults: ISelectboxSelectionPluginEnhancementsDefaults,
                ) => selectboxSelectionWithCursorComposites(pluginsLoaded, primitives, defaults),
            },
        ] as const
    }

function selectboxSelectionWithCursorComposites(
    // TODO: try to better define pluginsLoaded's type (in all plugins)
    pluginsLoaded: Record<string, IPluginApplianceEnriched<unknown>>,
    primitives: ReturnType<typeof rawPrimitives>,
    _defaults: ISelectboxSelectionPluginEnhancementsDefaults,
) {
    const cursorActions = pluginsLoaded.cursor.pluginActions.actions

    return {
        cursorMoveSelectboxSelection: (selector: IElementSelector, selectionIndex: number) =>
            asyncSequence([
                cursorActions.moveCursorToElement(selector),
                pluginsLoaded.core.primitives.delay(),
                cursorActions.clickEffectOnly(),
                primitives.showSelectboxSelection(selector),
                pluginsLoaded.core.primitives.delay(),
                cursorActions.moveCursorToElement(selectboxSelection.option(selectionIndex)),
                pluginsLoaded.core.primitives.delay(),
                cursorActions.clickEffectOnly(),
                primitives.hideSelectboxSelection(selectionIndex),
                pluginsLoaded.core.primitives.delay(),
            ]),
    }
}
