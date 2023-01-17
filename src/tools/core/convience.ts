import {mbDefault} from '../utils'
import {delay} from './actions'
import {IPluginAppliance} from '../plugin'

export interface IDefaultsa {
    duration: number
}

export const convience = (pluginsLoaded: Record<string, IPluginAppliance<unknown>>, defaults: IDefaultsa) => ({
    delay: (duration?: number) => delay(mbDefault(duration, defaults.duration)),
})
