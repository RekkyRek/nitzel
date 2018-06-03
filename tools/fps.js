class FPS {
	constructor() {
		this.lastFramtime = performance.now()
		this.lastRender = performance.now()
		this.textElement = new Text("fps", 0, 14, 14, "#000000")
	}

	draw (ctx) {
		if(performance.now() - this.lastRender > 100) {
			this.textElement.text = `FPS: ${Math.floor(1000 / (performance.now() - this.lastFramtime))}`
			this.lastRender = performance.now()
		}
		this.textElement.draw(ctx)
		this.lastFramtime = performance.now()
	}
}