/**
 * Logs a message.
 */
export const log = (message: string) => async () => {
    console.log(message)
}

/*
    TODO: support these overloads (?)

    export const log = (namespace: string, message: string) => async () => {
        console.log(message)
    }

    export const log = (...args: data: any[]) => async () => {
        console.log(message)
    }
*/
