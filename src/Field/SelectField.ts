import { noop, toArray } from '../utils'
import FieldInterface from './FieldInterface'

export default class SelectField implements FieldInterface<string|string[]> {
    private _listener = noop

    constructor (
        private _el:HTMLSelectElement
    ) {
    }

    watch (onTouched:() => void, onChanged:() => void) {
        this.release()
        this._el.addEventListener('change', this._listener = () => {
            onTouched()
            onChanged()
        })
    }

    release () {
        this._el.removeEventListener('change', this._listener)
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
