import { IPluginAppliance } from '../plugin'
import { IStagingElements } from './setup'

/**
 * Default values for Staging plugin composites.
 */
export interface IStagingPluginDefaults {
    delayClapboard: number
}

/**
 * Staging plugin's composites.
 */
export const composites =
    (elements: IStagingElements, _primitives: Record<string, never>) =>
    (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: IStagingPluginDefaults) => {
        // clapboard operations
        const showClapboard = async (): Promise<void> => {
            elements.clapboardOverlay.style.visibility = 'visible'
        }
        const hideClapboard = async (): Promise<void> => {
            elements.clapboardOverlay.style.visibility = 'hidden'
        }

        return {
            /**
             * Show the screen covering curtain.
             */
            showCurtain: () => (): Promise<void> => {
                const animationPromise = new Promise<void>((resolve) => {
                    elements.curtainOverlay.addEventListener('transitionend', () => resolve(), { once: true })
                    elements.curtainOverlay.style.opacity = '1'
                })

                return animationPromise
            },

            /**
             * Hide the screen covering curtain.
             */
            hideCurtain: () => (): Promise<void> => {
                const animationPromise = new Promise<void>((resolve) => {
                    elements.curtainOverlay.addEventListener('transitionend', () => resolve(), { once: true })
                    elements.curtainOverlay.style.opacity = '0'
                })

                return animationPromise
            },

            /**
             * Clap with the scren covering clapboard.
             */
            clapboard: () =>
                pluginsLoaded.core.primitives.asyncSequence([
                    () => showClapboard(),
                    pluginsLoaded.core.primitives.delay(defaults.delayClapboard),
                    () => hideClapboard(),
                ]),
        }
    }
