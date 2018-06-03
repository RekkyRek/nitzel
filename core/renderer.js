class Renderer {
	constructor() {
		this.canvas = document.getElementById('canvas')
		this.ctx = canvas.getContext('2d')


		this.mouse = new Mouse()

		this.objects = []

		this.canvas.height = this.canvas.clientHeight
		this.canvas.width = this.canvas.clientWidth

		setInterval(() => this.draw(), 1000 / 60)
	}

	draw() {
		this.ctx.fillStyle = "#ffffff"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		this.objects.forEach(object => {
			object.draw(this.ctx, this)
		})
		this.mouse.justPressed = false
	}
}
