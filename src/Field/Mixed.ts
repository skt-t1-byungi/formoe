import { FieldElement, FieldValue } from '../types'
import { noop, remove } from '../utils'
import CheckBoxField from './CheckBox'
import FieldInterface from './Interface'
import RadiosField from './Radios'
import SelectField from './Select'
import TextField from './Text'

export default class Mixed implements FieldInterface<FieldValue[]> {
    private _fields:Array<FieldInterface<any>> = []
    private _fieldMap = new Map<FieldElement, FieldInterface<any>>()
    private _radioField:RadiosField|null = null

    private _onTouched:() => void = noop
    private _onChanged:() => void = noop

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

        remove(this._fields, field)
    }

    watch (onTouched:() => void, onChanged:() => void) {
        this._onTouched = onTouched
        this._onChanged = onChanged
    }

    value () {
        const values = this._fields.map(field => field.value()).filter(v => v !== undefined)
        return values.length > 1 ? values : values[0]
    }

    reset (values:FieldValue[]) {
        values.forEach((val, i) => this._fields[i].reset(val))
    }
}
