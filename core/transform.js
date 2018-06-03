class Transform {
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