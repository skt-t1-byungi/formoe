import { toArray } from '../utils'
import Field from './Interface'

export default class SelectField implements Field <string|string[]> {
    constructor (
        private _el:HTMLSelectElement
    ) {
    }

    onTouched (listener:() => void) {
        this._el.addEventListener('change', listener)
    }

    onChanged (listener:() => void) {
        this._el.addEventListener('change', listener)
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
