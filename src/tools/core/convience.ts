import {mbDefault} from '../utils'
import {delay} from './actions'
import {IPluginAppliance} from '../plugin'

export interface IDefaults {
    duration: number
}


export const convience = (pluginsLoaded: Record<string, IPluginAppliance>, defaults: IDefaults) => ({
    delay: (duration?: number) => delay(mbDefault(duration, defaults.duration)),
})
