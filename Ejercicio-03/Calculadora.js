class Calculadora {

    constructor() {
        this.maxDisplaySize = 70
        this.minDisplaySize = 25
        this.maxDigits = 16
        this.digitThreshold = 6
    }

    load() {
        this.createBaseElements()
        this.createButtons()
        this.onCreate()
    }

    createBaseElements() {
        this.calculator = document.createElement("section")
        this.display = document.createElement("section")
        this.input = document.createElement("input")
        this.buttonContainer = document.createElement("section")

        this.calculator.setAttribute("class", "calculator")
        this.display.setAttribute("class", "display")
        this.buttonContainer.setAttribute("class", "button-container")
        this.input.type = "text"
        this.input.placeholder = 0
        this.input.readOnly = true

        document.body.appendChild(this.calculator)
        this.calculator.appendChild(this.display)
        this.calculator.appendChild(this.buttonContainer)
        this.display.appendChild(this.input)
    }

    isNum(val) {
        return !isNaN(val) || val == "." || val == "+" || val == "-"
    }

    addButton(tag, onClick = null) {
        let bt = this.createButton(tag, onClick)
        this.buttonContainer.appendChild(bt)
        return bt
    }

    createButton(tag, onClick = null) {
        let bt = document.createElement("button")
        bt.type = 'button'
        bt.innerText = tag
        bt.classList.add('basic-button')

        if (tag.length != 0 && !isNaN(tag))
            bt.classList.add('numeric')

        if (!onClick)
            bt.addEventListener("click", e => {
                if (!this.isNum(tag) && this.isNum(this.displayed))
                    return

                this.append(tag)
            })
        else bt.addEventListener("click", onClick)

        return bt
    }

    createButtons() {
        this.recoverMemBT = this.addButton('MR', e => this.loadMemory())

        this.addButton('M+', e => this.addMemory())
        this.addButton('M-', e => this.substractMemory())
        this.addButton('÷', e => this.append('/'))

        this.addButton(7)
        this.addButton(8)
        this.addButton(9)
        this.addButton('×', e => this.append('*'))

        this.addButton(4)
        this.addButton(5)
        this.addButton(6)
        this.addButton('-')

        this.addButton(1)
        this.addButton(2)
        this.addButton(3)
        this.addButton('+')

        this.addButton('.')
        this.addButton(0)
        this.addButton('C', e => this.clear())
    }

    onCreate() {
        this.clearMemory()

        // = al final siempre
        let equalsBT = this.addButton('=', e => this.calculate())
        equalsBT.setAttribute("class", "button-calculate")
        this.updateView()
    }

    append(val) {
        this.setDisplayed(this.displayed == '0' ? val : this.input.value + val)
        this.input.scrollLeft = this.input.scrollWidth;
    }

    /**
     * Actualiza el tamaño de la entrada, adapta tamaño desde 7 digitos hasta 22 (de 75px a 25px)
     */
    updateView(field = this.input) {
        let length = field.value.length
        let val = this.maxDisplaySize
        if (length >= this.digitThreshold && length < this.maxDigits)
            val = (this.maxDisplaySize - this.minDisplaySize) * (1 - (length - this.digitThreshold) / (this.maxDigits - this.digitThreshold)) + this.minDisplaySize
        else if (length >= this.maxDigits)
            val = this.minDisplaySize

        /*
            No hubo otra manera para poder modificar el tamaño de la letra y adaptarla al tamaño de la pantalla en función de los carácteres que haya
        */
        field.style.fontSize = val + "px"
        this.removeError()
    }

    clear() {
        this.setDisplayed(null)
    }

    get displayed() {
        return this.input.value
    }

    formatInput(input) {
        return input
    }

    calculate(v = this.displayed) {
        let r = this.evaluate(v)
        if (r == false && (!Number.isInteger(r) || isNaN(r)))
            return false

        this.setDisplayed(r)
        return r;
    }

    evaluate(expr) {
        if (expr)
            try {
                let r = eval(this.formatInput(expr))
                if (r == undefined) {
                    this.onError()
                    return false
                }

                return r
            } catch (e) {
                this.onError()
            }

        return false
    }

    setDisplayed(val, input = this.input) {
        if (val == undefined)
            val = 0
        input.value = val
        this.updateView(input)
    }

    onError() {
        this.input.classList.add('error')
        setTimeout(() => this.removeError(), 2000)
    }

    removeError() {
        this.input.classList.remove('error')
    }

    trySaveInMemory(saved) {
        if (this.displayed)
            if (!isNaN(saved))
                this.onSuccessStore(saved)
    }

    onSuccessStore(saved) {
        this.recoverMemBT.disabled = false
        this.mem = saved
    }

    loadMemory() {
        this.setDisplayed(this.mem)
    }

    addMemory() {
        this.trySaveInMemory(this.evaluate(`${this.mem}+(${this.displayed})`))
    }

    substractMemory() {
        this.trySaveInMemory(this.evaluate(`${this.mem}-(${this.displayed})`))
    }

    clearMemory() {
        this.recoverMemBT.disabled = true
        this.mem = 0
    }
}