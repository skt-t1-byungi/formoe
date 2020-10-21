import FieldInterface from './Field/FieldInterface'
import SelectField from './Field/SelectField'
import TextField from './Field/TextField'
import ToggleField from './Field/ToggleField'
import { FieldElement, FieldValue } from './types'
import { remove } from './utils'

export default class FieldManager {
    private _fields:Array<FieldInterface<any>> = []
    private _fieldMap = new Map<FieldElement, FieldInterface<any>>()
    private _isOnlyRadios = false

    constructor (
        private _onChanged:() => void,
        private _onTouched:() => void
    ) {
    }

    register (el:FieldElement) {
        let isRadio = false

        const newField = el instanceof HTMLTextAreaElement
            ? new TextField(el)
            : el instanceof HTMLSelectElement
                ? new SelectField(el)
                : el.type === 'checkbox' || (isRadio = el.type === 'radio')
                    ? new ToggleField(el)
                    : new TextField(el)

        if (isRadio) {
            if (this._fields.length === 0) this._isOnlyRadios = true
        } else {
            this._isOnlyRadios = false
        }

        this._fields.push(newField)
        this._fieldMap.set(el, newField)
        newField.watch(this._onTouched, this._onChanged)
    }

    unregister (el:FieldElement) {
        remove(this._fields, this._fieldMap.get(el))
        this._fieldMap.delete(el)
    }

    isEmpty () {
        return this._fields.length === 0
    }

    value () {
        const values = this._fields.map(field => field.value()).filter(v => v !== undefined)
        return values.length > 1 ? values : values[0]
    }

    reset (values:FieldValue[]) {
        values.forEach((val, i) => this._fields[i].reset(val))
    }
}
