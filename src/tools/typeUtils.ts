// TODO: rewrite examples in descriptions to use real examples e.g. MyTypeXY<MyParameter1> -> MyResultType

/////////////////// Flatten object /////////////////////////////////////////////

// util types for SimpleFlattenObject
type ObjKeyof<T> = T extends object ? keyof T : never
type KeyofKeyof<T> = ObjKeyof<T> | { [K in keyof T]: ObjKeyof<T[K]> }[keyof T]
type StripNever<T> = Pick<T, { [K in keyof T]: [T[K]] extends [never] ? never : K }[keyof T]>
type Lookup<T, K> = T extends any ? (K extends keyof T ? T[K] : never) : never

/**
 * Flattens `Record<X, Record<Y, U>>` into `Record<X, U>`.
 *
 * `{a: {b: '1', c: '2'}, d: '3', ...}` -> `{b: '1', c: '2', d: '3', ...}`
 */
export type SimpleFlattenObject<T> = T extends object
    ? StripNever<{
          [K in KeyofKeyof<T>]:
              | Exclude<K extends keyof T ? T[K] : never, object>
              | { [P in keyof T]: Lookup<T[P], K> }[keyof T]
      }>
    : T

/////////////////// FlattenArray ///////////////////////////////////////////////

// util types for FlattenArrayRecursive
type FlattenArrayRecursiveInner<T> = T extends []
    ? []
    : T extends [infer T0, ...infer Ts]
    ? [...FlattenArrayRecursiveInner<T0>, ...FlattenArrayRecursiveInner<Ts>]
    : [T]

/**
 * Flattens array. Deeply nested arrays are allowed.
 *
 * NOTE: Presence of `never` item anywhere in the array will results in `never`.
 *
 * `['a', 'b', ['c'], ['d', 'e'], ['f', ['g']], []]` -> `['a', 'b', 'c', 'd', 'e', 'f', 'g']`
 * `['a', 'b', never, never, 'e']` -> `never`
 */
export type FlattenArrayRecursive<T extends unknown[]> = FlattenArrayRecursiveInner<T>

/**
 * Filters array. Empty arrays are considered as empty value and are discarded.
 * Needs to have valid array types well defined to keep tuple types working.
 *
 * NOTE: Presence of `never` item anywhere in the array will results in `never`.
 *
 * `['a', [], 'c', [], 'e']` -> `['a', 'c', 'e']`
 */
export type FilterArray<
    T extends readonly (ValidArrayItem | [])[],
    ValidArrayItem,
    Result extends readonly ValidArrayItem[] = [],
> = T extends readonly [infer T0]
    ? T0 extends ValidArrayItem
        ? readonly [...Result, T0]
        : Result
    : T extends readonly [infer T0, ...infer Ts]
    ? T0 extends ValidArrayItem
        ? Ts extends (ValidArrayItem | [])[]
            ? FilterArray<Ts, ValidArrayItem, readonly [...Result, T0]>
            : 'this can never happen' // this is prevented by `FlattenArrayOneLevel` parameters definition
        : Ts extends (ValidArrayItem | [])[]
        ? FilterArray<Ts, ValidArrayItem, Result>
        : Result
    : any

/////////////////// Misc ///////////////////////////////////////////////////////

/**
 * Converts Record's value into type union.
 *
 * `{myProperty: 1,  myOtherProperty: 2, ...}` -> `1 | 2 | ...`
 */
export type RecordValuesToUnion<T> = {
    [P in keyof T]: T[P]
}[keyof T]

/**
 *   Converts union type to intersection of its parts.
 *
 * `{a: string} | {b: number}` -> {a: string} & {b: number} or `'myText' | string` -> `string`.
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * Returns last subtype of type union.
 *
 * `1 | 2 | 3` -> `3`
 */
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never

/**
 * Adds item to array/tuple.
 *
 * `[1, 2, 3]` + 'anotherOne' -> [1, 2, 3, 'anotherOne']
 */
type Push<T extends readonly any[], V> = readonly [...T, V]

/**
 * Creates tuple containing all subtypes from type union.
 *
 * `1 | 2 | 3` -> `[1, 2, 3]`
 */
export type TupleFromUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
    ? []
    : Push<TupleFromUnion<Exclude<T, L>>, L>

/**
 * Converts object keys to tuple.
 *
 * `{a: 1, b: 2, c: 3}` -> `[a, b, c]`
 */
export type ObjKeysTuple<T> = TupleFromUnion<keyof T>

/**
 *   Filters empty items out of Record. What is considered empty value can must be specified.
 *
 *  `{a: '1', b: null, c: undefined}` filter out `null | undefined` -> {a: '1'}
 */
export type FilterEmptyProperties<T extends Record<string, unknown>, EmptyType> = {
    [K in keyof T as T[K] extends EmptyType ? never : K]: T[K]
}

/**
 * Retrieves return types of array/tuple items (functions).
 *
 * `[() => void, (myParameter: string) => number, () => null]` -> `[void, number, null]`
 */
export type TupleReturnTypes<T extends readonly ((...args: any[]) => any)[]> = {
    [K in keyof T]: ReturnType<T[K]>
}

/**
 * Converts array into Record indexed by a specified propertyName that's present in all array item elements.
 * Can be used to extract only selected property from each element.
 *
 * `[{myProperty: 'a', ...}, {myProperty: 'b', ...}, ...]` -> `{a: {myProperty: 'a', ...}, b: {myProperty: 'b', ...}}`
 * `[{myProperty: 'a', ...}, {myProperty: 'b', ...}, ...]` + select `myProperty` -> `{a: 'a'}, {b: 'b'}, ...}`
 */
export type ArrayToRecord<
    Array extends readonly any[],
    Key extends keyof Array[number],
    Value extends keyof Array[number] | undefined = undefined,
> = {
    [K in Array[number] as K[Key]]: Value extends keyof K ? K[Value] : K
}

export type ArrayMap<Array extends readonly any[], Key extends keyof Array[number]> = Readonly<{
    [K in keyof Array]: Array[K][Key]
}>

/**
 * Creates intersaction of two tuples.
 *
 * `['a', 'b', 'c']` + `['b', 'c', 'd']` -> `'b' | 'd'`
 */
export type TupleIntersection<T1 extends readonly string[], T2 extends readonly string[]> = T1[number] & T2[number]

/**
 * Merges properties of two objects.
 *
 * `{a: 1, z: 1}` + `{d: 2, p: 2}` -> `{a: 1, z: 1, d: 2, p: 2}`
 */
export type MergeTwoObjects<A, B> = {
    [K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : 'this can never happen'
}

/**
 * Merges properties of up to 10 objects.
 *
 * `{a: 1, z: 1}` + `{b: 2, y: 2}` + `{c: 3, x: 3}` -> `{a: 1, z: 1, b: 2, y: 2, c: 3, x: 3}`
 */
export type MergeObjects<
    A,
    B,
    C = object,
    D = object,
    E = object,
    F = object,
    G = object,
    H = object,
    I = object,
    J = object,
> = MergeTwoObjects<
    A,
    MergeTwoObjects<
        B,
        MergeTwoObjects<
            C,
            MergeTwoObjects<
                D,
                MergeTwoObjects<E, MergeTwoObjects<F, MergeTwoObjects<G, MergeTwoObjects<H, MergeTwoObjects<I, J>>>>>
            >
        >
    >
>
