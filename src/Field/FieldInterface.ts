import { FieldValue } from '../types'

export default interface FieldInterface<T extends FieldValue> {
    watch(onTouched:() => void, onChanged:() => void):void
    release():void
    value():T|undefined
    reset(val:T):void
}
