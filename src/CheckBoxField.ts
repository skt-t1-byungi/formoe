import { Field } from './types'

export default class CheckBoxField implements Field {
    private _isTouched = false

    constructor (
        private _el:HTMLInputElement,
        onChange:(ev:Event)=>void
    ) {
        _el.addEventListener('change', (ev) => {
            this._isTouched = true
            onChange(ev)
        })
    }

    value () {
        if (this._el.value === 'on') return this._el.checked
        return this._el.checked ? this._el.value : undefined
    }

    reset (val?:string|boolean) {
        this._isTouched = false

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

    isDirty () {
        return this._isTouched && this._el.checked !== this._el.defaultChecked
    }

    isTouched () {
        return this._isTouched
    }
}
