import { noop } from '../utils'
import FieldInterface from './FieldInterface'

export default class CheckBoxField implements FieldInterface<string|boolean> {
    private _onTouched:() => void = noop
    private _onChanged:() => void = noop

    constructor (
        private _el:HTMLInputElement
    ) {
        _el.addEventListener('change', () => {
            this._onTouched()
            this._onChanged()
        })
    }

    watch (onTouched:() => void, onChanged:() => void) {
        this._onTouched = onTouched
        this._onChanged = onChanged
    }

    value () {
        const el = this._el
        return el.value === 'on' ? el.checked
            : el.checked ? el.value
                : undefined
    }

    reset (val:string|boolean) {
        const el = this._el
        switch (typeof val) {
            case 'string':
                el.defaultValue = el.value = val
                el.defaultChecked = el.checked = true
                break
            case 'boolean':
                el.defaultChecked = el.checked = val
                break
            default:
                el.defaultChecked = el.checked = false
        }
    }
}
