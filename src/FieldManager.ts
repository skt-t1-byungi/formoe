import FieldInterface from './Field/Interface'
import RadiosField from './Field/Radios'

type FieldElement = HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement

export default class FieldManager {
    private _fields:Array<FieldInterface<any>> = []
    private _fieldMap = new Map<FieldElement, FieldInterface<any>>()
    private _radioField:RadiosField|null = null
    private _value:any = null
    private _isTouched = false
    private _isDirty = false

    add (el:FieldElement) {
    }

    remove (el:FieldElement) {
        const field = this._fieldMap.get(el)!

        if (field instanceof RadiosField) {
            field.remove(el as HTMLInputElement)
            if (!field.isEmpty()) return
            this._radioField = null
        }

        const fields = this._fields
        fields.splice(fields.indexOf(field) >>> 0, 1)
    }

    getField (el:FieldElement) {
        return this._fieldMap.get(el)
    }

    value () {
        if (this._value !== null) return this._value

        const values = this._fields.map(field => field.value()).filter(v => v !== undefined)
        return this._value = values.length > 1 ? values : values[0]
    }

    reset () {}

    get isTouched () {
        return this._isTouched
    }

    get isDirty () {
        return this._isDirty
    }
}
