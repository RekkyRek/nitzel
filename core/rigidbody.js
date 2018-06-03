class Rigidbody {
	constructor(gravity, damp) {
		this.velocity = {x:0,y:0}
		this.damp = damp
		this.gravity = gravity
	}

	addForce(x,y) {
		this.velocity.x += x
		this.velocity.y += y
	}

	apply(transform) {
		transform.move(
			transform.absx + this.velocity.x,
			transform.absy + this.velocity.y
		)
	}

	physicsTick() {
		this.velocity.y += this.gravity

		this.velocity.x *= this.damp
		this.velocity.y *= this.damp
	}
}