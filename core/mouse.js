class Mouse {
	constructor() {
		this.x = 10
		this.y = 10
		this.justPressed = false
		this.pressed = false

		this.onMove = this.onMove.bind(this)
		this.onUp = this.onUp.bind(this)
		this.onDown = this.onDown.bind(this)

		window.addEventListener('mousemove', this.onMove)
		window.addEventListener('mouseup', this.onUp)
		window.addEventListener('mousedown', this.onDown)
	}

	onMove(e) {
		this.x = e.clientX
		this.y = e.clientY
	}

	onUp(e) {
		this.pressed = false
	}

	onDown(e) {
		this.pressed = true
		this.justPressed = true
	}
}