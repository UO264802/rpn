class CalculadoraCientifica extends Calculadora {

    constructor() {
        super()
        this.switchableButtons = []
        this.switched = false
        this.maxDisplaySize = 75
        this.maxDigits = 17
        this.digitThreshold = 7
    }

    createButtons() {
        this.clearMemBT = this.addButton('MC', e => this.clearMemory())
        this.recoverMemBT = this.addButton('MR', e => this.loadMemory())
        this.addButton('M+', e => this.addMemory())
        this.addButton('M-', e => this.substractMemory())
        this.addButton('MS', e => this.storeDisplayed())

        this.switchableButton(
            this.createButton('log', e => this.append('log(')),
            this.createButton('ln', e => this.append('ln('))
        )
        this.switchableButton(
            this.createButton('1/x', e => this.applyExpression(`1/(%D)`)),
            this.createButton('10ˣ', e => this.applyExpression('pow(10,%D)'))
        )
        this.switchableButton(
            this.createButton('sin', e => this.append('sin(')),
            this.createButton('sin⁻¹', e => this.append('sin⁻¹('))
        )
        this.switchableButton(
            this.createButton('cos', e => this.append('cos(')),
            this.createButton('cos⁻¹', e => this.append('cos⁻¹('))
        )
        this.switchableButton(
            this.createButton('tan', e => this.append('tan(')),
            this.createButton('tan⁻¹', e => this.append('tan⁻¹('))
        )

        this.switchableButton(
            this.createButton('x²', e => this.applyExpression('pow(%D,2)')),
            this.createButton('x³', e => this.applyExpression('pow(%D,3)'))
        )
        this.addButton('xʸ', e => this.append('pow('))
        this.addButton('√x', e => this.append('sqrt('))
        this.addButton('EXP', e => this.append('e'))
        this.addButton('mod', e => this.append('%'))

        this.addButton('eˣ', e => this.append('exp('))
        this.switchBT = this.addButton('...', e => this.switch())
        this.addButton('C', e => this.clear())
        this.addButton('⭠', e => this.backspace())
        this.addButton('÷', e => this.append('/'))

        this.addButton('π', e => this.append('π'))
        this.addButton(7)
        this.addButton(8)
        this.addButton(9)
        this.addButton('×', e => this.append('*'))

        this.addButton('n!', e => this.factorial())
        this.addButton(4)
        this.addButton(5)
        this.addButton(6)
        this.addButton('-')

        this.switchableButton(
            this.createButton(',', e => this.append(',')),
            this.createButton('±', e => this.applyExpression(`-(%D)`))
        )
        this.addButton(1)
        this.addButton(2)
        this.addButton(3)
        this.addButton('+')

        this.addButton('(')
        this.addButton(')')
        this.addButton(0)
        this.addButton('.')
    }

    switchableButton(bt1, bt2) {
        this.switchableButtons.push([bt1, bt2])
        this.buttonContainer.appendChild(bt1)
    }

    switch() {
        this.switched = !this.switched
        let a = 0, r = 0
        if (this.switched) {
            a = 1
            this.switchBT.classList.add('active')
        } else {
            r = 1
            this.switchBT.classList.remove('active')
        }

        this.switchableButtons.forEach(e => this.buttonContainer.replaceChild(e[a], e[r]))
    }

    formatInput(input) {
        return super.formatInput(input)
            .replace(/pow/g, "Math.pow")
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/log/g, 'Math.log10')
            .replace(/ln/g, 'Math.log')
            .replace(/π/g, 'Math.PI')
            .replace(/exp/g, 'Math.exp')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/sin⁻¹\(/g, 'Math.asin(')
            .replace(/cos⁻¹\(/g, 'Math.acos(')
            .replace(/tan⁻¹\(/g, 'Math.atan(')
    }

    factorial() {
        let fact = n => {
            var v = 1;
            for (var i = 2; i <= n; i++)
                v = v * i;
            return v;
        }

        this.applyFunction(fact)
    }

    applyFunction(func) {
        let r = this.evaluate(this.displayed)
        if (r == false && (!Number.isInteger(r) || isNaN(r)))
            return
        this.setDisplayed(func(r))
    }

    applyExpression(expression) {
        this.calculate(expression.replace('%D', this.displayed))
    }

    onSuccessStore(saved) {
        super.onSuccessStore(saved)
        this.clearMemBT.disabled = false
    }

    clearMemory() {
        this.clearMemBT.disabled = true
        super.clearMemory()
    }

    storeDisplayed() {
        this.trySaveInMemory(this.evaluate(this.displayed))
    }

    backspace() {
        this.setDisplayed(this.displayed.substring(0, this.displayed.length - 1))
    }
}