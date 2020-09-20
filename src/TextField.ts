import { Field } from './types'

export default class TextField implements Field {
    private _isTouched = false

    constructor (
        private _el:HTMLInputElement|HTMLTextAreaElement,
        onChange:(ev:Event)=>void
    ) {
        _el.addEventListener('blur', (ev) => {
            if (!this._isTouched) {
                this._isTouched = true
                onChange(ev)
            }
        })
        _el.addEventListener('input', onChange)
    }

    value () {
        return this._el.value
    }

    reset (val?:string|boolean) {
        this._isTouched = false
        if (val) this._el.defaultValue = this._el.value = String(val)
    }

    isDirty () {
        return this._el.value !== this._el.defaultValue
    }

    isTouched () {
        return this._isTouched
    }
}
