class PhysicsTester {
	constructor() {
		this.first = new Rect(400, 0, 24, 24, "red")
		this.second = new Rect(300, 600, 500, 24, "green")
		this.third = new Rect(200, 400, 200, 200, "green")
		this.rigidbodyText = new Text("dist", 150, 112, 14, "blue")
		this.colliderText = new Text("dist", 150, 100, 14, "blue")
		this.rigidbody = new Rigidbody(0.98, 0.97)

		this.first.collider = new Collider(this.first.x, this.first.y, this.first.h, this.first.w)
		this.second.collider = new Collider(this.second.x, this.second.y, this.second.h, this.second.w)
		this.third.collider = new Collider(this.third.x, this.third.y, this.third.h, this.third.w)
	}

	draw(ctx, renderer) {
		this.rigidbody.physicsTick(this.first, [this.second.collider,this.third.collider])
		if(renderer.mouse.justPressed) {
			if(renderer.mouse.x > this.first.x) {
				this.rigidbody.addForce(2.5, -10)
			} else {
				this.rigidbody.addForce(-2.5, -10)
			}
		}
		this.rigidbody.apply(this.first)

		this.second.move(300, 400 + Math.sin(performance.now() / 1000) * 20)

		this.first.draw(ctx, renderer)
		this.second.draw(ctx, renderer)
		this.third.draw(ctx, renderer)

		this.rigidbodyText.text = `Velocity: x${this.rigidbody.velocity.x.toFixed(3)},y${this.rigidbody.velocity.y.toFixed(3)}`

		this.rigidbodyText.x = renderer.mouse.x
		this.rigidbodyText.y = renderer.mouse.y

		this.rigidbodyText.draw(ctx)


		this.colliderText.text = `Collider: ${this.first.collider.collided},x${this.first.collider.xpush.toFixed(3)},y${this.first.collider.ypush.toFixed(3)}`

		this.colliderText.x = renderer.mouse.x
		this.colliderText.y = renderer.mouse.y - 18

		this.colliderText.draw(ctx)
	}
}

const renderer = new Renderer()

renderer.objects.push(new PhysicsTester())
renderer.objects.push(new FPS())
