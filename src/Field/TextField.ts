import { noop } from '../utils'
import FieldInterface from './FieldInterface'

export default class TextField implements FieldInterface<string|number> {
    private _unwatch = noop

    constructor (
        private _el:HTMLInputElement|HTMLTextAreaElement
    ) {
    }

    watch (onTouched:() => void, onChanged:() => void) {
        this._unwatch()

        const el = this._el
        el.addEventListener('blur', onTouched)
        el.addEventListener('input', onChanged)

        this._unwatch = () => {
            el.removeEventListener('blur', onTouched)
            el.removeEventListener('input', onChanged)
        }
    }

    release () {
        this._unwatch()
    }

    value () {
        const el = this._el
        return el.type === 'number' ? (el as HTMLInputElement).valueAsNumber : el.value
    }

    reset (val:string|number) {
        this._el.defaultValue = this._el.value = String(val)
    }
}
