class DistanceTester {
	constructor() {
		this.first = new Rect(250, 350, 24, 24, "red")
		this.second = new Rect(550, 200, 24, 24, "green")
		this.distText = new Text("dist", 100, 100, 14, "blue")
	}

	draw(ctx, renderer) {
		this.first.move(renderer.mouse.x,renderer.mouse.y)
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

renderer.objects.push(new DistanceTester())
renderer.objects.push(new FPS())
