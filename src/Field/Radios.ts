import { noop } from '../utils'
import FieldInterface from './Interface'

export default class RadiosField implements FieldInterface<string|string[]> {
    private _radios:HTMLInputElement[] = []

    private _onTouched:() => void = noop
    private _onChanged:() => void = noop
    private _listener = () => {
        this._onTouched()
        this._onChanged()
    }

    add (radio:HTMLInputElement) {
        radio.addEventListener('change', this._listener)
        this._radios.push(radio)
    }

    remove (radio:HTMLInputElement) {
        radio.removeEventListener('change', this._listener)
        const radios = this._radios
        radios.splice(radios.indexOf(radio) >>> 0, 1)
    }

    isEmpty () {
        return this._radios.length === 0
    }

    watch (onTouched:() => void, onChanged:() => void) {
        this._onTouched = onTouched
        this._onTouched = onChanged
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
