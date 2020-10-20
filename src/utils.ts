export function noop () {}

export function toArray<T> (arrLike:ArrayLike<T>):T[] {
    return Array.prototype.slice.call(arrLike)
}

export function isEmptyObj (obj:Record<string, any>) {
    for (const _ in obj) return false
    return true
}

export function remove <T> (arr:T[], el:T) {
    return arr.splice(arr.indexOf(el) >>> 0, 1), arr
}
