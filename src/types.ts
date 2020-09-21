export interface Field {
    watch(watcher:(ev:Event) => void):void
    value():string|boolean|Array<string|boolean>|undefined
    reset(val?:string|boolean):void
    isDirty():boolean
    isTouched():boolean
}
