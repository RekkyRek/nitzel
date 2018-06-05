class Rect extends Transform {
	constructor(x, y, h, w, c) {
		super(x, y, h, w)
		this.color = c
	}
	draw(ctx, renderer) {
			ctx.save()
			ctx.translate(this.absx, this.absy)
			ctx.rotate(this.r / 10 * Math.PI/180)
			ctx.fillStyle = this.color
			ctx.fillRect(-this.w / 2, -this.h / 2, this.h, this.w)
			ctx.restore()
		
	}
}

console.log(Rect)

class Circle extends Transform {
	constructor(x, y, r, c) {
		super(x, y, r, r)
		this.color = c
	}
	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.h, 0, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
	}
}

class Text extends Transform {
	constructor(t, x, y, s, c) {
		super(x, y, s, s)
		this.color = c
		this.text = t
	}
	draw(ctx) {
		ctx.font = `${this.h}px sans-serif`
		ctx.fillStyle = this.color
		ctx.fillText(this.text, this.x, this.y)
		ctx.stroke()
	}
}

class Sprite extends Transform {
	constructor(x, y, s, image) {
		super(x, y, h, w)
		this.image = c
	}
	draw(ctx) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.h, this.w)
	}
}