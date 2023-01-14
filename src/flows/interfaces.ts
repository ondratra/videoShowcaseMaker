import * as tools from '../tools'

export interface IVideoElements {
    documentBody: HTMLElement
    cursorElements: tools.cursor.ICursorElements
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