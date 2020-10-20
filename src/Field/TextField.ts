import { noop } from '../utils'
import FieldInterface from './FieldInterface'

export default class TextField implements FieldInterface<string|number> {
    private _onTouched:() => void = noop
    private _onChanged:() => void = noop

    constructor (
        private _el:HTMLInputElement|HTMLTextAreaElement
    ) {
        this._el.addEventListener('blur', () => this._onTouched())
        this._el.addEventListener('input', () => this._onChanged())
    }

    watch (onTouched:() => void, onChanged:() => void) {
        this._onTouched = onTouched
        this._onChanged = onChanged
    }

    value () {
        const el = this._el
        return el.type === 'number' ? (el as HTMLInputElement).valueAsNumber : el.value
    }

    reset (val:string|number) {
        this._el.defaultValue = this._el.value = String(val)
    }
}
