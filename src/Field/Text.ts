import Field from './Interface'

export default class TextField implements Field<string|number> {
    constructor (
        private _el:HTMLInputElement|HTMLTextAreaElement
    ) {
    }

    onTouched (listener:() => void) {
        this._el.addEventListener('blur', listener)
    }

    onChanged (listener:() => void) {
        this._el.addEventListener('input', listener)
    }

    value () {
        const el = this._el
        return el.type === 'number' ? (el as HTMLInputElement).valueAsNumber : el.value
    }

    reset (val:string|number) {
        this._el.defaultValue = this._el.value = String(val)
    }
}
