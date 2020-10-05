import FieldInterface from './Interface'

export default class CheckBoxField implements FieldInterface<string|boolean> {
    constructor (
        private _el:HTMLInputElement
    ) {
    }

    onTouched (listener:() => void) {
        this._el.addEventListener('change', listener)
    }

    onChanged (listener:() => void) {
        this._el.addEventListener('change', listener)
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
