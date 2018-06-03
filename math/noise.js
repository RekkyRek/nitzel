class NoiseHelpers {
	constructor() {
		this.F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
		this.G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
		this.F3 = 1.0 / 3.0;
		this.G3 = 1.0 / 6.0;
		this.F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
		this.G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
	}
	alea() {
	    let s0 = 0;
	    let s1 = 0;
	    let s2 = 0;
	    let c = 1;

	    let mash = this.masher();
	    s0 = mash(' ');
	    s1 = mash(' ');
	    s2 = mash(' ');

	    for (let i = 0; i < arguments.length; i++) {
			s0 -= mash(arguments[i]);
			if (s0 < 0) {
				s0 += 1;
			}
			s1 -= mash(arguments[i]);
			if (s1 < 0) {
				s1 += 1;
			}
			s2 -= mash(arguments[i]);
			if (s2 < 0) {
				s2 += 1;
			}
	    }
	    mash = null;
	    return function() {
			let t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
			s0 = s1;
			s1 = s2;
			return s2 = t - (c = t | 0);
	    };
	}
	masher() {
	    let n = 0xefc8249d;
	    return function(data) {
			data = data.toString();
			for (let i = 0; i < data.length; i++) {
				n += data.charCodeAt(i);
				let h = 0.02519603282416938 * n;
				n = h >>> 0;
				h -= n;
				h *= n;
				n = h >>> 0;
				h -= n;
				n += h * 0x100000000; // 2^32
			}
			return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
	    };
	}
	buildPermutationTable(random) {
		let i;
		let p = new Uint8Array(256);
		for (i = 0; i < 256; i++) {
			p[i] = i;
		}
		for (i = 0; i < 255; i++) {
			let r = i + ~~(random() * (256 - i));
			let aux = p[i];
			p[i] = p[r];
			p[r] = aux;
		}
		return p;
	}
}

class SimplexNoise {
	constructor(randomOrSeed) {
	    let random;

	    this.helpers = new NoiseHelpers()

	    if (typeof randomOrSeed == 'function') {
	      random = randomOrSeed;
	    }
	    else if (randomOrSeed) {
	      random = this.helpers.alea(randomOrSeed);
	    } else {
	      random = Math.random;
	    }
	    this.p = this.helpers.buildPermutationTable(random);
	    this.perm = new Uint8Array(512);
	    this.permMod12 = new Uint8Array(512);
	    for (let i = 0; i < 512; i++) {
	      this.perm[i] = this.p[i & 255];
	      this.permMod12[i] = this.perm[i] % 12;
	    }

	    this.grad3 = new Float32Array([
	    	1, 1, 0,
			-1, 1, 0,
			1, -1, 0,

			-1, -1, 0,
			1, 0, 1,
			-1, 0, 1,

			1, 0, -1,
			-1, 0, -1,
			0, 1, 1,

			0, -1, 1,
			0, 1, -1,
			0, -1, -1
		])

		this.grad4 = new Float32Array([
			0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
			0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
			1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
			-1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
			1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
			-1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
			1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
			-1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0
		])
	}

    noise2D (xin, yin, scale = 10) {
    	xin = xin / scale
    	yin = yin / scale

		let permMod12 = this.permMod12;
		let perm = this.perm;
		let grad3 = this.grad3;
		let n0 = 0, n1 = 0, n2 = 0;
		// Skew the input space to determine which simplex cell we're in
		let s = (xin + yin) * this.helpers.F2; // Hairy factor for 2D
		let i = Math.floor(xin + s);
		let j = Math.floor(yin + s);
		let t = (i + j) * this.helpers.G2;
		let X0 = i - t; // Unskew the cell origin back to (x,y) space
		let Y0 = j - t;
		let x0 = xin - X0; // The x,y distances from the cell origin
		let y0 = yin - Y0;
		// For the 2D case, the simplex shape is an equilateral triangle.
		// Determine which simplex we are in.
		let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
		if (x0 > y0) {
			i1 = 1;
			j1 = 0;
		} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
		else {
			i1 = 0;
			j1 = 1;
		} // upper triangle, YX order: (0,0)->(0,1)->(1,1)
		// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
		// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
		// c = (3-sqrt(3))/6
		let x1 = x0 - i1 + this.helpers.G2; // Offsets for middle corner in (x,y) unskewed coords
		let y1 = y0 - j1 + this.helpers.G2;
		let x2 = x0 - 1.0 + 2.0 * this.helpers.G2; // Offsets for last corner in (x,y) unskewed coords
		let y2 = y0 - 1.0 + 2.0 * this.helpers.G2;
		// Work out the hashed gradient indices of the three simplex corners
		let ii = i & 255;
		let jj = j & 255;
		// Calculate the contribution from the three corners
		let t0 = 0.5 - x0 * x0 - y0 * y0;
		if (t0 >= 0) {
			let gi0 = permMod12[ii + perm[jj]] * 3;
			t0 *= t0;
			n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
		}
		let t1 = 0.5 - x1 * x1 - y1 * y1;
		if (t1 >= 0) {
			let gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
			t1 *= t1;
			n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
		}
		let t2 = 0.5 - x2 * x2 - y2 * y2;
			if (t2 >= 0) {
			let gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
			t2 *= t2;
			n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
		}
		// Add contributions from each corner to get the final noise value.
		// The result is scaled to return values in the interval [-1,1].
		return 70.0 * (n0 + n1 + n2);
	}

	noise3D (xin, yin, zin, scale = 10) {
		xin = xin / scale
    	yin = yin / scale
    	zin = zin / scale

		let permMod12 = this.permMod12;
		let perm = this.perm;
		let grad3 = this.grad3;
		let n0, n1, n2, n3; // Noise contributions from the four corners
		// Skew the input space to determine which simplex cell we're in
		let s = (xin + yin + zin) * this.helpers.F3; // Very nice and simple skew factor for 3D
		let i = Math.floor(xin + s);
		let j = Math.floor(yin + s);
		let k = Math.floor(zin + s);
		let t = (i + j + k) * this.helpers.G3;
		let X0 = i - t; // Unskew the cell origin back to (x,y,z) space
		let Y0 = j - t;
		let Z0 = k - t;
		let x0 = xin - X0; // The x,y,z distances from the cell origin
		let y0 = yin - Y0;
		let z0 = zin - Z0;
		// For the 3D case, the simplex shape is a slightly irregular tetrahedron.
		// Determine which simplex we are in.
		let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
		let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
		if (x0 >= y0) {
			if (y0 >= z0) {
				i1 = 1;
				j1 = 0;
				k1 = 0;
				i2 = 1;
				j2 = 1;
				k2 = 0;
			} // X Y Z order
			else if (x0 >= z0) {
				i1 = 1;
				j1 = 0;
				k1 = 0;
				i2 = 1;
				j2 = 0;
				k2 = 1;
			} // X Z Y order
			else {
				i1 = 0;
				j1 = 0;
				k1 = 1;
				i2 = 1;
				j2 = 0;
				k2 = 1;
			} // Z X Y order
		}
		else { // x0<y0
			if (y0 < z0) {
				i1 = 0;
				j1 = 0;
				k1 = 1;
				i2 = 0;
				j2 = 1;
				k2 = 1;
			} // Z Y X order
			else if (x0 < z0) {
				i1 = 0;
				j1 = 1;
				k1 = 0;
				i2 = 0;
				j2 = 1;
				k2 = 1;
			} // Y Z X order
			else {
				i1 = 0;
				j1 = 1;
				k1 = 0;
				i2 = 1;
				j2 = 1;
				k2 = 0;
			} // Y X Z order
		}
		// A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
		// a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
		// a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
		// c = 1/6.
		let x1 = x0 - i1 + this.helpers.G3; // Offsets for second corner in (x,y,z) coords
		let y1 = y0 - j1 + this.helpers.G3;
		let z1 = z0 - k1 + this.helpers.G3;
		let x2 = x0 - i2 + 2.0 * this.helpers.G3; // Offsets for third corner in (x,y,z) coords
		let y2 = y0 - j2 + 2.0 * this.helpers.G3;
		let z2 = z0 - k2 + 2.0 * this.helpers.G3;
		let x3 = x0 - 1.0 + 3.0 * this.helpers.G3; // Offsets for last corner in (x,y,z) coords
		let y3 = y0 - 1.0 + 3.0 * this.helpers.G3;
		let z3 = z0 - 1.0 + 3.0 * this.helpers.G3;
		// Work out the hashed gradient indices of the four simplex corners
		let ii = i & 255;
		let jj = j & 255;
		let kk = k & 255;
		// Calculate the contribution from the four corners
		let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
		if (t0 < 0) n0 = 0.0;
		else {
			let gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
			t0 *= t0;
			n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
		}
		let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
		if (t1 < 0) n1 = 0.0;
		else {
			let gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
			t1 *= t1;
			n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
		}
		let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
		if (t2 < 0) n2 = 0.0;
		else {
			let gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
			t2 *= t2;
			n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
		}
		let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
		if (t3 < 0) n3 = 0.0;
		else {
			let gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
			t3 *= t3;
			n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
		}
		// Add contributions from each corner to get the final noise value.
		// The result is scaled to stay just inside [-1,1]
		return 32.0 * (n0 + n1 + n2 + n3);
	}
}