class PhysicsTester {
	constructor() {
		this.first = new Rect(0, 0, 24, 24, "red")
		this.second = new Rect(550, 200, 24, 24, "green")
		this.distText = new Text("dist", 100, 100, 14, "blue")
		this.rigidbody = new Rigidbody(0.98, 0.97)
	}

	draw(ctx, renderer) {
		this.second.move(renderer.mouse.x, renderer.mouse.y)

		this.rigidbody.addForce((this.second.x - this.first.x) / 200, (this.second.y - this.first.y) / 100)
		this.rigidbody.physicsTick()
		this.rigidbody.apply(this.first)

		this.first.draw(ctx, renderer)
		this.second.draw(ctx, renderer)

		ctx.beginPath()
		ctx.moveTo(this.first.absx, this.first.absy)
		ctx.lineTo(this.second.absx, this.second.absy)
		ctx.closePath()

		this.distText.text = parseInt(Vector2D.distance(this.first, this.second))

		this.distText.x = (this.first.x + this.second.x) / 2
		this.distText.y = (this.first.y + this.second.y) / 2

		this.distText.draw(ctx)
	}
}

const renderer = new Renderer()

renderer.objects.push(new PhysicsTester())
renderer.objects.push(new FPS())
