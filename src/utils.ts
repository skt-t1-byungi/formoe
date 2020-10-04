export function noop () {}

export function toArray<T> (arrLike:ArrayLike<T>):T[] {
    return Array.prototype.slice.call(arrLike)
}

export function isEmptyObj (obj:Record<string, any>) {
    for (const _ in obj) return false
    return true
}
