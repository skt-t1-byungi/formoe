import CheckBoxField from './Field/CheckBoxField'
import FieldInterface from './Field/FieldInterface'
import RadioField from './Field/RadioField'
import SelectField from './Field/SelectField'
import TextField from './Field/TextField'
import { FieldElement, FieldValue } from './types'
import { remove } from './utils'

export default class FieldManager {
    private _fields:Array<FieldInterface<any>> = []
    private _radios:RadioField[] = []
    private _fieldMap = new Map<FieldElement, FieldInterface<any>>()

    constructor (
        private _onChanged:() => void,
        private _onTouched:() => void
    ) {
    }

    register (el:FieldElement) {
        const fields = this._fields
        const fieldMap = this._fieldMap

        if (el instanceof HTMLInputElement && el.type === 'radio') {
            let radios:RadiosField|null = null
            if (fields.length === 1 && fields[0] instanceof RadiosField) {
                radios = fields[0] as RadiosField
            } else {
                fields.push(radios = new RadiosField())
                radios.watch(this._onTouched, this._onChanged)
            }

            radios.add(el)
            fieldMap.set(el, radios)
            return
        }

        const field = el instanceof HTMLTextAreaElement
            ? new TextField(el)
            : el instanceof HTMLSelectElement
                ? new SelectField(el)
                : el.type === 'checkbox'
                    ? new CheckBoxField(el)
                    : new TextField(el)

        fields.push(field)
        fieldMap.set(el, field)
        field.watch(this._onTouched, this._onChanged)
    }

    unregister (el:FieldElement) {
        const field = this._fieldMap.get(el)!

        if (field instanceof RadiosField) {
            field.remove(el as HTMLInputElement)
            if (!field.isEmpty()) return
            this._radioField = null
        }

        remove(this._fields, field)
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
