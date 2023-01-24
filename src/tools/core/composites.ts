import { IPluginAppliance } from '../plugin'
import { mbDefault } from '../utils'
import { delay } from './primitives'

export interface IDefaultsa {
    duration: number
}

export const composites = (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: IDefaultsa) => ({
    delay: (duration?: number) => delay(mbDefault(duration, defaults.duration)),
})
