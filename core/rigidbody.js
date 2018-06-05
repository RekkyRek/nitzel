class Rigidbody {
	constructor(gravity, damp) {
		this.velocity = {x:0,y:0}
		this.rotateVelocity = 0
		this.damp = damp
		this.gravity = gravity
	}

	addForce(x,y) {
		this.velocity.x += x
		this.velocity.y += y
	}

	addSpin(a) {
		this.rotateVelocity += a
	}

	apply(transform) {
		transform.move(
			transform.absx + this.velocity.x,
			transform.absy + this.velocity.y
		)

		transform.rotate(this.rotateVelocity)
	}

	physicsTick(transform, colliders) {
		let tmp = transform.collider

		this.velocity.y += this.gravity

		if(transform.collider) {
			transform.collider.collide(colliders)
		}

		if(transform.collider.collided) {
			this.velocity.y = -transform.collider.ypush
			this.velocity.x = -transform.collider.xpush
		}

		transform.collider = tmp

		// this.rotateVelocity = Math.log(Math.abs(this.velocity.x * this.velocity.y)) * 10
		this.velocity.x *= this.damp
		this.velocity.y *= this.damp

		//this.rotateVelocity *= this.damp
		//console.log(this.rotateVelocity)
	}
}