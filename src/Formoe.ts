import FieldManager from './FieldManager'
import { FieldElement, FieldValue, FormValue } from './types'
import { noop } from './utils'

export default class Formoe {
    private _touches:Record<string, boolean> = Object.create(null)
    private _errors:Record<string, any> = Object.create(null)
    private _values:FormValue = Object.create(null)
    private _defaultValues:FormValue = Object.create(null)
    private _fieldMap = new Map<string, FieldManager>()
    private _rules:Record<string, (val:FieldValue, values:FormValue) => string|void>= {}

    register (el:FieldElement) {
        this._register(el)
        const { name } = el
        this._values[name] = this._fieldMap.get(name)!.value()
    }

    private _register (el:FieldElement) {
        const { name } = el
        const fieldMap = this._fieldMap

        if (!fieldMap.has(name)) {
            const fieldManager = new FieldManager(
                () => {
                    this._touches[name] = true
                },
                () => {
                    const values = this._values
                    const rule = this._rules[name] ?? noop
                    this._errors[name] = rule(values[name] = fieldManager.value(), values)
                }
            )
            fieldMap.set(name, fieldManager)
        }

        fieldMap.get(name)!.register(el)
    }

    unregister (el:FieldElement) {
        const { name } = el
        const fieldMap = this._fieldMap
        if (!fieldMap.has(name)) return

        const fieldManager = fieldMap.get(name)!
        fieldManager.unregister(el)

        if (fieldManager.isEmpty()) {
            fieldMap.delete(name)
            delete this._touches[name]
            delete this._errors[name]
            delete this._values[name]
        }
    }
}
