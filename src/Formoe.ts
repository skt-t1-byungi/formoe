import FieldInterface from './Field/FieldInterface'
import SelectField from './Field/SelectField'
import TextField from './Field/TextField'
import ToggleField from './Field/ToggleField'
import { FieldElement, FieldValue } from './types'
import { isEmpty, noop, remove } from './utils'

const FIELD_NAME_RE = /^(?:input|select|textarea)/i
const PREVENT_TYPE_RE = /^(?:submit|button|image|reset|file)$/i

export default class Formoe {
    private _touches:Record<string, boolean> = Object.create(null)
    private _dirties:Record<string, boolean> = Object.create(null)
    private _errors:Record<string, any> = Object.create(null)
    private _values:Record<string, FieldValue> = Object.create(null)
    private _defaultValues:Record<string, FieldValue> = Object.create(null)
    private _fieldMapByEl = new Map<FieldElement, FieldInterface<any>>()
    private _fieldsMapByName = new Map<string, Array<FieldInterface<any>>>()
    private _ruleMap = new Map<string, (val:FieldValue, values:Record<string, FieldValue>) => string|void>()
    private _submitCount = 0
    private _isSubmitting = false
    private _isSubmitted = false

    get touches () { return this._touches }
    get dirties () { return this._dirties }
    get errors () { return this._errors }
    get values () { return this._value }
    get defaultValues () { return this._defaultValues }
    get isTouched () { return isEmpty(this._touches) }
    get isDirty () { return isEmpty(this._dirties) }
    get isValid () { return isEmpty(this._errors) }

    constructor (
        form:HTMLFontElement,
        {
            submit = noop
        } = {}
    ) {
        Array.from<FieldElement>(form.querySelectorAll('[name]:not(:disabled)'))
            .filter(el => FIELD_NAME_RE.test(el.nodeName) && !PREVENT_TYPE_RE.test(el.type))
            .forEach(el => this._register(el))

        Array.from(this._fieldsMapByName.keys()).map(name => this._update(name))
        Object.assign(this._defaultValues, this._value)
    }

    register (el:FieldElement) {
        this._register(el)
        this._update(el.name)
    }

    private _register (el:FieldElement) {
        const fieldMap = this._fieldMapByEl
        if (fieldMap.has(el)) {
            throw new TypeError('This element is already registered.')
        }

        const newField = el instanceof HTMLTextAreaElement
            ? new TextField(el)
            : el instanceof HTMLSelectElement
                ? new SelectField(el)
                : el.type === 'checkbox' || el.type === 'radio'
                    ? new ToggleField(el)
                    : el instanceof HTMLTextAreaElement ? new TextField(el)
                        : null

        if (!newField) {
            throw new TypeError('`el` is not a field element type.')
        }

        const { name } = el
        const fieldsMap = this._fieldsMapByName

        if (!fieldsMap.has(name)) fieldsMap.set(name, [])
        fieldsMap.get(name)!.push(newField)
        fieldMap.set(el, newField)

        newField.watch(
            () => {
                this._touches[name] = true
            },
            () => {
                this._update(name)
            })
    }

    private _update (name:string) {
        const values = this._values
        const value = values[name] = this._value(name)
        this._dirties[name] = value === this._defaultValues[name]

        const rule = this._ruleMap.get(name) ?? noop
        this._errors[name] = rule(value, values)
    }

    private _value (name:string) {
        const fields = this._fieldsMapByName.get(name) ?? []
        const value = fields.map(field => field.value()).filter(v => v !== undefined)
        return value.length > 1 ? value : value[0]
    }

    unregister (el:FieldElement) {
        const fieldMap = this._fieldMapByEl
        if (!fieldMap.has(el)) return

        const field = fieldMap.get(el)!
        const fieldsMap = this._fieldsMapByName
        const { name } = el
        const fields = fieldsMap.get(name)!

        fieldMap.delete(el)
        remove(fields, field)
        field.release()

        if (fields.length === 0) {
            fieldsMap.delete(name)
            delete this._touches[name]
            delete this._dirties[name]
            delete this._errors[name]
            delete this._values[name]
            delete this._defaultValues[name]
        } else {
            this._update(name)
        }
    }

    meta (name:string) {
        if (!this._fieldsMapByName.has(name)) return
        return {
            touched: this._touches[name],
            dirty: this._dirties[name],
            error: this._errors[name],
            value: this._values[name],
            defaultValue: this._defaultValues[name]
        }
    }

    reset (newValues:Record<string, FieldValue> = this._defaultValues) {
    }
}
