class Collider {
	constructor(x,y,h,w) {
		this.x = x
		this.y = y
		this.h = h
		this.w = w
		this.collided = false
		this.xdiff = 0
		this.ydiff = 0
		this.xpush = 0
		this.ypush = 0
	}

	collide(colliders, ctx)  {
		let collided = false
		colliders.forEach((c) => {

			if(
				this.x + this.w > c.x && this.x < c.x + c.w &&
				this.y + this.h > c.y && this.y < c.y + c.h
			) {
				collided = true
				this.xpush = Math.min(this.x + this.w - c.x, Math.abs(this.x - c.x - c.w))
				this.ypush = Math.min(this.y + this.h - c.y, Math.abs(this.y - c.y - c.h))

				if(this.xpush > this.ypush) { this.xpush = 0 } else
				if(this.ypush > this.xpush) { this.ypush = 0 }

				if (this.xpush === Math.abs(this.x - c.x - c.w)) { this.xpush = -this.xpush }
				if (this.ypush === Math.abs(this.y - c.y - c.h)) { this.ypush = -this.ypush }

				this.xdiff = this.x + this.w - (c.x + c.w) + this.w
				this.ydiff = this.y + this.h - c.y
			}
		})
		this.collided = collided
	}
}