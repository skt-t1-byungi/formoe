export default interface FieldInterface<T> {
    watch(onTouched:() => void, onChanged:() => void):void
    value():T|undefined
    reset(val:T):void
}
