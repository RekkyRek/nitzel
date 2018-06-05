class Transform {
	constructor(x, y, w, h) {
		this.absx = x
		this.absy = y
		this.x = x - w / 2
		this.y = y - h / 2
		this.r = 0
		this.h = h
		this.w = w

		this.collider = undefined
	}
	move(x, y) {
		this.absx = x
		this.absy = y
		this.x = x - this.w / 2
		this.y = y - this.h / 2

		if(this.collider !== undefined) {
			this.collider.x = this.x
			this.collider.y = this.y
		}
	}
	rotate(r) {
		this.r = r
	}
	size(h, w) {
		this.h = h
		this.w = w
		if(this.collider !== undefined) {
			this.collider.h = h
			this.collider.w = w
		}
	}
	scale(h, w) {
		this.x = this.x - w / 2
		this.y = this.y - h / 2
		this.h = h
		this.w = w
	}
}