/////////////////// SimpleFlatten //////////////////////////////////////////////

// util types for SimpleFlatten
type ObjKeyof<T> = T extends object ? keyof T : never
type KeyofKeyof<T> = ObjKeyof<T> | { [K in keyof T]: ObjKeyof<T[K]> }[keyof T]
type StripNever<T> = Pick<T, { [K in keyof T]: [T[K]] extends [never] ? never : K }[keyof T]>
type Lookup<T, K> = T extends any ? (K extends keyof T ? T[K] : never) : never

/**
    Flattens `Record<X, Record<Y, U>>` into `Record<X, U>`.

    `{a: {b: '1', c: '2'}, d: '3', ...}` -> `{b: '1', c: '2', d: '3', ...}`
*/
export type SimpleFlatten<T> = T extends object
    ? StripNever<{
          [K in KeyofKeyof<T>]:
              | Exclude<K extends keyof T ? T[K] : never, object>
              | { [P in keyof T]: Lookup<T[P], K> }[keyof T]
      }>
    : T

/////////////////// Misc ///////////////////////////////////////////////////////

/**
    Converts Record's value into type union.

    `{myProperty: 1,  myOtherProperty: 2, ...}` -> `1 | 2 | ...`
*/
export type RecordValuesToUnion<T> = {
    [P in keyof T]: T[P]
}[keyof T]

/**
    Converts union type to intersection of its parts.

    `{a: string} | {b: number}` -> {a: string} & {b: number} or `'myText' | string` -> `string`.
*/
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
    Filter empty items out of Record. What is considered empty value can must be specified.

    `{a: '1', b: null, c: undefined}` filter out `null | undefined` -> {a: '1'}
*/
export type FilterEmptyProperties<T extends Record<string, unknown>, EmptyType> = {
    [K in keyof T as T[K] extends EmptyType ? never : K]: T[K]
}

/**
    Converts array into Record indexed by a specified propertyName that's present in all array item elements.

    `[{myProperty: 'a', ...}, {myProperty: 'b', ...}, ...]` -> `{a: {myProperty: 'a', ...}, b: {myProperty: 'b', ...}}`
*/
export type ArrayToRecord<Array extends readonly any[], Key extends keyof Array[number] & (string | number)> = {
    [K in Array[number] as K[Key]]: K
}
