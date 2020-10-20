import { noop, toArray } from '../utils'
import FieldInterface from './FieldInterface'

export default class SelectField implements FieldInterface <string|string[]> {
    private _onTouched:() => void = noop
    private _onChanged:() => void = noop

    constructor (
        private _el:HTMLSelectElement
    ) {
        _el.addEventListener('change', () => {
            this._onTouched()
            this._onChanged()
        })
    }

    watch (onTouched:() => void, onChanged:() => void) {
        this._onTouched = onTouched
        this._onChanged = onChanged
    }

    value () {
        return this._el.multiple
            ? toArray(this._el.options).filter(opt => opt.selected).map(opt => opt.value)
            : this._el.value
    }

    reset (val:string|string[]) {
        const map = (Array.isArray(val) ? val : [val]).reduce((o, v) => (o[v] = true, o), {} as Record<string, true>)
        toArray(this._el.options).forEach(opt => {
            opt.defaultSelected = opt.selected = (map[opt.value] && delete map[opt.value]) || false
        })
    }
}
