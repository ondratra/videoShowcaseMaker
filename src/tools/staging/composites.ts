import { IPluginAppliance } from '../plugin'
import { IStagingElements } from './setup'

/**
 * Default values for Staging plugin composites.
 */
export interface IStagingPluginDefaults {}

/**
 * Staging plugin's composites.
 */
export const composites =
    (elements: IStagingElements, _primitives: Record<string, never>) =>
    (_pluginsLoaded: Record<string, IPluginAppliance<unknown>>, _defaults: IStagingPluginDefaults) => {
        return {
            showCurtain: (): Promise<void> => {
                const animationPromise = new Promise<void>((resolve) => {
                    elements.curtainOverlay.addEventListener('transitionend', () => resolve(), { once: true })
                    elements.curtainOverlay.style.opacity = '1'
                })

                return animationPromise
            },

            hideCurtain: (): Promise<void> => {
                const animationPromise = new Promise<void>((resolve) => {
                    elements.overlayElement.addEventListener('transitionend', () => resolve(), { once: true })
                    elements.overlayElement.style.opacity = '0'
                })

                return animationPromise
            },

            showClipboard: async (): Promise<void> => {
                elements.clapboardOverlay.style.visibility = 'visible'
            },

            hideClipboard: async (): Promise<void> => {
                elements.clapboardOverlay.style.visibility = 'hidden'
            },
        }
    }
