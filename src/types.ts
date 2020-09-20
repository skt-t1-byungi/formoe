export interface Field {
    value():string|boolean|undefined
    reset(val?:string|boolean):void
    isDirty():boolean
    isTouched():boolean
}
