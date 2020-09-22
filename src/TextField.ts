import { Field } from './types'

export default class TextField implements Field<string|number> {
    private _isTouched = false

    constructor (
        private _el:HTMLInputElement|HTMLTextAreaElement
    ) {
    }

    watch (watcher:(ev:Event) => void):void {
        this._el.addEventListener('blur', (ev) => {
            if (!this._isTouched) {
                this._isTouched = true
                watcher(ev)
            }
        })
        this._el.addEventListener('input', watcher)
    }

    value () {
        const el = this._el
        return el.type === 'number' ? (el as HTMLInputElement).valueAsNumber : el.value
    }

    reset (val?:string|number) {
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
