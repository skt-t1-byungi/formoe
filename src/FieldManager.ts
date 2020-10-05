import FieldInterface from './Field/Interface'

type FieldElement = HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement

export default class FieldManager {
    private _fields:Array<FieldInterface<any>> = []
    private _fieldMap = new Map<FieldElement, FieldInterface<any>>()
    private _selectField = null

    add (el:FieldElement) {
    }

    remove (el:FieldElement) {
    }

    getField (el:FieldElement) {
    }

    value () {
    }
}
