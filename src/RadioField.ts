import noop from './noop'
import { Field } from './types'

export default class RadioField implements Field {
    private _isTouched = false
    private _listener:(ev:Event) => void = noop

    constructor (
        private _radios:HTMLInputElement[] = []
    ) {
    }

    add (radio:HTMLInputElement) {
        radio.addEventListener('change', this._listener)
        this._radios.push(radio)
    }

    remove (radio:HTMLInputElement) {
        const radios = this._radios
        radios.splice(radios.indexOf(radio) >>> 0, 1)
    }

    watch (watcher:(ev:Event) => void) {
        const listener = (ev:Event) => {
            this._isTouched = true
            watcher(ev)
        }
        this._radios.forEach(radio => {
            radio.removeEventListener('change', this._listener)
            radio.addEventListener('change', listener)
        })
        this._listener = listener
    }

    value () {
        const values = this._radios.filter(radio => radio.checked).map(radio => radio.value)
        return values.length === 0 ? undefined
            : values.length === 1 ? values[0]
                : values
    }

    reset (val?:string|boolean) {
    }

    isDirty () {
        // return this._radios.every(radio => radio.checked === radio.defaultChecked)
    }

    isTouched () {
        return this._isTouched
    }
}
