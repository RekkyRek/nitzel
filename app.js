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

class Object {
	constructor(x, y, h, w) {
		this.x = x
		this.y = y
		this.h = h
		this.w = w
	}
	move(x, y) {
		this.x = x
		this.y = y
	}
	size(h, w) {
		this.h = h
		this.w = w
	}
	scale(h, w) {
		this.x = this.x - w / 2
		this.y = this.y - h / 2
		this.h = h
		this.w = w
	}
}

class Rect extends Object {
	constructor(x, y, h, w, c) {
		super(x, y, h, w)
		this.color = c
	}
	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.h, this.w)
	}
}


class Sprite extends Object {
	constructor(x, y, s, image) {
		super(x, y, h, w)
		this.image = c
	}
	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.h, this.w)
	}
}

class Text extends Object {
	constructor(t, x, y, s, c) {
		super(x, y, s, s)
		this.color = c
		this.text = t
	}
	draw(ctx) {
		ctx.font = `${this.h}px sans-serif`
		ctx.fillStyle = this.color
		ctx.fillText(this.text, this.x, this.y)
		ctx.stroke()
	}
}

class FPS {
	constructor() {
		this.lastFramtime = performance.now()
		this.textElement = new Text("fps", 0, 14, 14, "#000000")
	}

	draw (ctx) {
		this.textElement.text = `FPS: ${Math.floor(1000 / (performance.now() - this.lastFramtime))}`
		this.lastFramtime = performance.now()
		this.textElement.draw(ctx)
	}
}

class PointDraw {
	constructor() {
		this.rectElement = new Rect(0, 0, 4, 4, "red")
		this.points = []
	}

	draw (ctx, renderer) {
		this.rectElement.move(renderer.mouse.x - 2, renderer.mouse.y - 2)
		this.rectElement.draw(ctx)
		if(renderer.mouse.justPressed) {
			this.points.push([renderer.mouse.x, renderer.mouse.y])
		}

		ctx.moveTo(this.points[0][0], this.points[0][1])
		ctx.fillStyle = "black"
		this.points.forEach(point => {
			ctx.lineTo(point[0], point[1])
		})
	}
}

class Canvas {
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

const renderer = new Canvas()

renderer.objects.push(new FPS())
renderer.objects.push(new PointDraw())
renderer.objects.push()