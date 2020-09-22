export interface Field<T> {
    watch(watcher:(ev:Event) => void):void
    value():T|undefined
    reset(val?:T):void
    isDirty():boolean
    isTouched():boolean
}
