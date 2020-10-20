import { isEmpty } from './utils'

type FieldValue = string|boolean|Array<string|boolean>
type FieldElement = HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement
type FormoeOptions = {defaultValues?:Record<string, FieldValue>; rules:Record<string, (v:FieldValue) => string|void>}

const instances = new WeakMap<Node, Formoe>()

const observer = new MutationObserver(mutations => {
    for (const mut of mutations) {
        const formoe = instances.get(mut.target)!
        if (mut.type === 'childList') {

        }
    }
})

export class Formoe {
    private _submitCount = 0
    private _isSubmitting = false
    private _isSubmitted = false
    private _dirties:Record<string, boolean> = Object.create(null)
    private _touches:Record<string, boolean> = Object.create(null)
    private _errors:Record<string, any> = Object.create(null)
    private _values:Record<string, string|boolean|Array<string|boolean>> = Object.create(null)
    private _changeListeners = Object.create(null)
    private _submitters = []

    constructor (form:HTMLFormElement, opts:FormoeOptions) {
        if (!(form instanceof HTMLFormElement)) {
            throw new TypeError('Expected "form" to be HTMLFormElement type.')
        }

        // Nodes registered in the Observer are weak references. Explicit release is unnecessary.
        // (https://dom.spec.whatwg.org/#mutation-observers)
        observer.observe(form, { childList: true, attributes: true, subtree: true })
        instances.set(form, this)
    }

    get isDirty () {
        return isEmpty(this._dirties)
    }

    get isTouched () {
        return isEmpty(this._touches)
    }

    get isValid () {
        return isEmpty(this._errors)
    }

    get isSubmitting () {
        return this._isSubmitting
    }

    get isSubmitted () {
        return this._isSubmitted
    }

    get submitCount () {
        return this._submitCount
    }

    get dirties () {
        return this._dirties
    }

    get touches () {
        return this._touches
    }

    get errors () {
        return this._errors
    }

    get values () {
        return this._values
    }

    get defaultValues () {
        return this._defaultValues
    }

    onChange () {}
    onSubmit () {}
    trigger () {}
    reset () {}
}

const FIELD_NAME_RE = /^(?:input|select|textarea)/i
const BTN_TYPE_RE = /^(?:submit|button|image|reset|file)$/i

function isField (el:any):el is FieldElement {
    return el.name && !el.disabled && FIELD_NAME_RE.test(el.nodeName) && !BTN_TYPE_RE.test(el.type)
}
