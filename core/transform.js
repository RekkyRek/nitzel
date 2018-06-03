class Transform {
	constructor(x, y, h, w) {
		this.absx = x
		this.absy = y
		this.x = x - w / 2
		this.y = y - h / 2
		this.h = h
		this.w = w
	}
	move(x, y) {
		this.absx = x
		this.absy = y
		this.x = x - this.w / 2
		this.y = y - this.h / 2
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