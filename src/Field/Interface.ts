export default interface FieldInterface<T> {
    onTouched(listener:() => void):void
    onChanged(listener:() => void):void
    value():T|undefined
    reset(val:T):void
}
