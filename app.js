class PhysicsTester {
	constructor() {
		this.first = new Rect(0, 0, 24, 24, "red")
		this.second = new Rect(550, 200, 24, 24, "green")
		this.distText = new Text("dist", 100, 100, 14, "blue")
		this.vel = {x: 0, y: 0}
		this.damp = 0.97
	}

	draw(ctx, renderer) {
		this.second.move(renderer.mouse.x, renderer.mouse.y)
		this.first.move(this.first.absx + this.vel.x, this.first.absy + this.vel.y)

		this.vel.x += (this.second.x - this.first.x) / 200
		this.vel.y += (this.second.y - this.first.y) / 100
		this.vel.y += 0.98

		this.vel.y *= this.damp
		this.vel.x *= this.damp

		this.first.draw(ctx)
		this.second.draw(ctx)
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
