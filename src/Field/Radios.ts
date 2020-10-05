import { noop } from '../utils'
import FieldInterface from './Interface'

export default class RadiosField implements FieldInterface<string|string[]> {
    private _touchListener:() => void = noop
    private _changeListener:() => void = noop

    constructor (
        private _radios:HTMLInputElement[] = []
    ) {
    }

    add (radio:HTMLInputElement) {
        radio.addEventListener('change', this._touchListener)
        radio.addEventListener('change', this._changeListener)
        this._radios.push(radio)
    }

    remove (radio:HTMLInputElement) {
        const radios = this._radios
        radios.splice(radios.indexOf(radio) >>> 0, 1)
    }

    onTouched (listener:() => void) {
        this._radios.forEach(radio => {
            radio.removeEventListener('change', this._touchListener)
            radio.addEventListener('change', listener)
        })
        this._touchListener = listener
    }

    onChanged (listener:() => void) {
        this._radios.forEach(radio => {
            radio.removeEventListener('change', this._changeListener)
            radio.addEventListener('change', listener)
        })
        this._changeListener = listener
    }

    value () {
        const values = this._radios.filter(radio => radio.checked).map(radio => radio.value)
        return values.length > 1 ? values : values[0]
    }

    reset (val:string|string[]) {
        const map = (Array.isArray(val) ? val : [val]).reduce((o, v) => (o[v] = true, o), {} as Record<string, true>)
        this._radios.forEach(radio => {
            radio.defaultChecked = radio.checked = (map[radio.value] && delete map[radio.value]) || false
        })
    }
}
