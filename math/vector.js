class Vector2D {
	static fastDistance(a, b) {
		var ax = a.x - b.x
		var by = a.y - b.y

		return ax*ax + by*by
	}

	static distance(a, b) {
		var ax = a.x - b.x
		var by = a.y - b.y

		return Math.sqrt( ax*ax + by*by )
	}
}