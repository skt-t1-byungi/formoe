import { noop } from '../utils'
import FieldInterface from './FieldInterface'

export default class ToggleField implements FieldInterface<string|boolean> {
    private _listener = noop

    constructor (
        private _el:HTMLInputElement
    ) {
    }

    watch (onTouched:() => void, onChanged:() => void) {
        this.release()
        this._el.addEventListener('change', this._listener = () => {
            onTouched()
            onChanged()
        })
    }

    release () {
        this._el.removeEventListener('change', this._listener)
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
