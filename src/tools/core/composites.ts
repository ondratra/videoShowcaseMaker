import { mbDefault } from '../utils'
import { delay } from './primitives'
import { IPluginAppliance } from '../plugin'

export interface IDefaultsa {
    duration: number
}

export const composites = (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: IDefaultsa) => ({
    delay: (duration?: number) => delay(mbDefault(duration, defaults.duration)),
})
