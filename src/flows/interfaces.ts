import * as tools from '../tools'

export interface IVideoElements {
    documentBody: HTMLElement
    cursorElements: tools.cursor.setup.ICursorElements // TODO: move the interface somewhere else (shouldn't be under `setup`)
    runClickEffect: () => Promise<void>
    /*
    subtitlesElements: ISubtitlesElements
    selectboxSelectionElements: ISelectboxSelectionElements
    chatboxElements: IChatboxElements
    curtainElements: ICurtainElements
    metamaskElements: IMetamaskElements
    clapboardElements: IClapboardElements
    */
}
