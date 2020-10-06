import CheckBoxField from './Field/CheckBox'
import FieldInterface from './Field/Interface'
import RadiosField from './Field/Radios'
import SelectField from './Field/Select'
import TextField from './Field/Text'

type FieldElement = HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement

export default class FieldManager {
    private _fields:Array<FieldInterface<any>> = []
    private _fieldMap = new Map<FieldElement, FieldInterface<any>>()
    private _radioField:RadiosField|null = null
    private _value:any = null
    private _isTouched = false

    private _onTouched = () => { this._isTouched = true }
    private _onChanged = () => { this._value = null }

    register (el:FieldElement) {
        if (el instanceof HTMLInputElement && el.type === 'radio') {
            const field = this._radioField ?? new RadiosField()
            field.add(el)
            this._fieldMap.set(el, field)

            if (!this._radioField) {
                this._fields.push(this._radioField = field)
                field.watch(this._onTouched, this._onChanged)
            }

            return
        }

        const field = el instanceof HTMLTextAreaElement
            ? new TextField(el)
            : el instanceof HTMLSelectElement
                ? new SelectField(el)
                : el.type === 'checkbox'
                    ? new CheckBoxField(el)
                    : new TextField(el)

        this._fields.push(field)
        this._fieldMap.set(el, field)
        field.watch(this._onTouched, this._onChanged)
    }

    unregister (el:FieldElement) {
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
        // return this._isDirty
    }
}
