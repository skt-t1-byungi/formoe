import MixedField from './Field/Mixed'
import { FieldElement, FieldValue, FormValue } from './types'
import { noop } from './utils'

export default class Formoe {
    private _touches:Record<string, boolean> = Object.create(null)
    private _errors:Record<string, any> = Object.create(null)
    private _values:FormValue = Object.create(null)
    private _defaultValues:FormValue = Object.create(null)
    private _mixedFieldMap = new Map<string, MixedField>()
    private _rules:Record<string, (val:FieldValue, values:FormValue) => string|void>= {}

    register (el:FieldElement) {
        this._register(el)
        const { name } = el
        this._values[name] = this._mixedFieldMap.get(name)!.value()
    }

    private _register (el:FieldElement) {
        const { name } = el
        const mixedFieldMap = this._mixedFieldMap

        if (!mixedFieldMap.has(name)) {
            const mixedField = new MixedField()
            mixedField.watch(
                () => {
                    this._touches[name] = true
                },
                () => {
                    const values = this._values
                    const rule = this._rules[name] ?? noop
                    this._errors[name] = rule(values[name] = mixedField.value(), values)
                })
            mixedFieldMap.set(name, mixedField)
        }

        mixedFieldMap.get(name)!.register(el)
    }

    unregister (el:FieldElement) {
        const { name } = el
        const mixedFieldMap = this._mixedFieldMap
        if (!mixedFieldMap.has(name)) return

        const mixedField = mixedFieldMap.get(name)!
        mixedField.unregister(el)

        if (mixedField.isEmpty()) {
            mixedFieldMap.delete(name)
            delete this._touches[name]
            delete this._errors[name]
            delete this._values[name]
        }
    }
}
