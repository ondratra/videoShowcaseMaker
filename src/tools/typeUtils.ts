
/////////////////// SimpleFlatten //////////////////////////////////////////////

// flatten `Record<X, Record<Y, U>>` into `Record<X, U>`

type ObjKeyof<T> = T extends object ? keyof T : never
type KeyofKeyof<T> = ObjKeyof<T> | { [K in keyof T]: ObjKeyof<T[K]> }[keyof T]
type StripNever<T> = Pick<T, { [K in keyof T]: [T[K]] extends [never] ? never : K }[keyof T]>
type Lookup<T, K> = T extends any ? K extends keyof T ? T[K] : never : never

export type SimpleFlatten<T> = T extends object ? StripNever<{ [K in KeyofKeyof<T>]:
    Exclude<K extends keyof T ? T[K] : never, object> |
        { [P in keyof T]: Lookup<T[P], K> }[keyof T]
    }> : T

/////////////////// Misc ///////////////////////////////////////////////////////

export type RecordToValuesUnion<T> = {
    [P in keyof T]: T[P]
}[keyof T]

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
