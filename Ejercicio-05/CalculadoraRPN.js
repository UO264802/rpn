class CalculadoraRPN extends CalculadoraCientifica {

    constructor() {
        super()
        this.maxDisplaySize = 55
        this.digitThreshold = 10
        this.maxDigits = 18
        this.stack = []
        this.inputs = []
        this.slots = 3
        this.buttons = {}
    }

    createBaseElements() {
        super.createBaseElements()

        this.inputs[0] = this.input

        for (let i = 1; i <= this.slots; i++) {
            let e = document.createElement("input")
            e.placeholder = 0
            e.style.color = this.displayColor
            e.style.fontSize = this.maxDisplaySize
            e.readOnly = true

            this.inputs[i] = e

            this.display.prepend(e)
        }

        this.updateInputs()
    }

    createButtons() {
        this.addRPNButton('Pop', e => this.pop())
        this.addRPNButton('Swap', e => this.swap())
        this.addRPNButton('AC', e => this.allCancel())
        let sp1 = this.addButton('', e => undefined)
        let sp2 = this.addButton('', e => undefined)
        sp1.disabled = true
        sp2.disabled = true

        super.createButtons()
    }

    addRPNButton(tag, onClick) {
        let bt = this.addButton(tag, onClick)
        bt.classList.add('rpn-button')
        return bt
    }

    addButton(tag, onClick = null) {
        let bt = super.addButton(tag, onClick)
        this.buttons[tag] = bt
        return bt
    }

    onCreate() {
        this.clearMemory()

        this.changeActionButton('+', e => this.operate('+'))
        this.changeActionButton('-', e => this.operate('-'))
        this.changeActionButton('×', e => this.operate('*'))
        this.changeActionButton('÷', e => this.operate('/'))
        this.changeActionButton('mod', e => this.operate('%'))
        this.changeActionButton('xʸ', e => this.operate('**'))

        let enterBT = this.addButton('Enter', e => this.enter())
        enterBT.setAttribute("class", "button-calculate")
    }

    changeActionButton(tag, newAction) {
        var oldE = this.buttons[tag]
        var newE = oldE.cloneNode(true)
        oldE.parentNode.replaceChild(newE, oldE)
        newE.addEventListener("click", newAction)
    }

    operate(operator) {
        let v = this.evaluate(`(${this.stack[1]})${operator}(${this.displayed})`)
        if ((v == false && !Number.isInteger(v)) || isNaN(v))
            return;

        this.stack.shift()
		this.stack[0] = v
        this.updateInputs()
    }

    updateInputs() {
        for (let i = 0; i <= this.slots; i++) {
			let v = this.stack[i]
			if (v == undefined)
				v = this.stack[i] = 0
			
            this.setDisplayed(v, this.inputs[i])
        }

        for (let i = this.slots + 1; i < this.stack.length; i++)
            this.stack.pop()
    }

    enter() {
        let v = this.calculate()
        if (v == false && !Number.isInteger(v))
            return;

        this.stack.shift()
        this.stack.splice(0, 0, v)
        this.stack.splice(0, 0, 0)
        this.updateInputs()
    }

    swap() {
        let v = this.calculate()
        if (v == false && !Number.isInteger(v))
            return;
        this.stack.shift()
        this.stack.splice(0, 0, v)

        let aux = this.stack[0]
        this.stack[0] = this.stack[1]
        this.stack[1] = aux
        this.updateInputs()
    }

    pop() {
        this.stack.shift()
        this.updateInputs()
    }

    allCancel() {
		this.stack = []
        this.updateInputs()
    }
}