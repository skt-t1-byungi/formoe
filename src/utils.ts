export function noop () {}

export function toArray<T> (arrLike:ArrayLike<T>):T[] {
    return Array.prototype.slice.call(arrLike)
}
