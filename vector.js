/**
 * @class Vector
 * A 2D vector with an x and y component
 *
 * Properties:
 * @property {number} x: the x (horizontal) component of the vector
 * @property {number} y: the y (vertical) component of the vector
 *
 * Methods:
 * @method magnitude: (getter) returns the magnitude of the vector
 * @method magnitude: (setter) sets the magnitude of the vector
 * @method angle: (getter) returns the angle of the vector
 * @method angle: (setter) sets the angle of the vector
 * @method inverse: (getter) returns a new vector opposite in direction to this one
 * @method multiply(): multiplies the components of the vector by a scalar value
 * @method divide(): divides the components of the vector by a scalar value
 * @method add(): sets the vector equal to the sum of itself and another vector
 * @method subtract(): sets the vector equal to the difference of itself and another vector
 * @method multipliedBy(): returns the product of the vector and a scalar value as a new vector
 * @method dividedBy(): returns the quotient of the vector and a scalar value as a new vector
 *
 * Static methods:
 * @method sum(): returns the sum of vectors
 * @method difference(): return the difference of vectors
 * @method dot(): returns the dot product of vectors
 */
class Vector {

    /**
     * @constructor
     * @param {number} x: x component of the vector
     * @param {number} y: y component of the vector
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @method set
     * Sets the vector's components to those of a new vector
     * @param {Vector} vector
     */
    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }

    /**
     * @method magnitude
     * Returns the magnitude of the vector
     * @returns {number}
     */
    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };

    /**
     * @method magnitude
     * Sets the magnitude of the vector
     * @param {number} mag: the new magnitude to assign to the vector
     */
    set magnitude(mag) {
        let factor = mag / this.magnitude;
        this.x *= factor;
        this.y *= factor;
    }

    /**
     * @method angle
     * Returns the angle/direction of the vector in radians
     * @returns {number}
     */
    get angle() {
        let angle = Math.atan2(-this.y, this.x);
        if (angle < 0) {
            angle += Math.PI * 2;
        }
        return angle;
    }

    /**
     * @method angle
     * Sets the angle/direction of the vector
     * @param {number} angle: the new angle to assign to the vector
     */
    set angle(angle) {
        let mag = this.magnitude;
        this.x = mag * Math.cos(angle);
        this.y = -(mag * Math.sin(angle));
    }

    /**
     * @method inverse
     * Returns a vector opposite in direction but equal in magnitude to this one
     * @returns {Vector}
     */
    get inverse() {
        return new Vector(-this.x, -this.y);
    }

    /**
     * @method multiply
     * Multiplies the vector by a scalar value
     * @param {number} scalar: the scalar value to multiply the vector by
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    /**
     * @method divide
     * Divides the vector by a scalar value
     * @param {number} scalar: the scalar value to divide the vector by
     */
    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    /**
     * @method add
     * Sets the vector equal to the sum of itself and another vector
     * @param {Vector} vector: the vector to add
     */
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    /**
     * @method subtract
     * Sets the vector equal to the difference of itself and another vector
     * @param {Vector} vector: the vector to subtract
     */
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    /**
     * @method multipliedBy
     * Returns the product of the vector and a scalar value as a new vector
     * @param {number} scalar: the scalar value to multiply the vector by
     * @returns {Vector}
     */
    multipliedBy(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    /**
     * @method dividedBy
     * Returns the quotient of the vector and a scalar value as a new vector
     * @param {number} scalar: the scalar value to divide the vector by
     * @returns {Vector}
     */
    dividedBy(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    /**
     * @method rotate
     * Rotates the vector relative to a point
     * @param {number} angle: the angle to rotate the vector by
     * @param {Vector} origin: the point of rotation
     */
    rotate(angle, origin) {
        this.subtract(origin);
        this.angle += angle;
        this.add(origin);
    }

    /**
     * @method unit
     * Returns the corresponding unit vector
     * @returns {Vector}
     */
    unit() {
        return new Vector(this.x / this.magnitude, this.y / this.magnitude);
    }

    /**
     * @method sum
     * Returns the sum of vector objects
     * @param {...Vector} vectors
     * @returns {Vector}
     */
    static sum(...vectors) {
        let x = 0;
        let y = 0;
        for (let element of vectors) {
            x += element.x;
            y += element.y;
        }
        return new Vector(x, y);
    }

    /**
     * @method difference
     * Returns the difference between vector objects
     * @param {Vector} minuend: the minuend vector
     * @param {...Vector} subtrahends: the subtrahend vectors
     * @returns {Vector}
     */
    static difference(minuend, ...subtrahends) {
        let x = minuend.x;
        let y = minuend.y;
        for (let element of subtrahends) {
            x -= element.x;
            y -= element.y;
        }
        return new Vector(x, y);
    }

    /**
     * @method dot
     * Returns the dot product of 2 vector objects
     * @param {...Vector} vectors
     * @returns {number}
     */
    static dot(...vectors) {
        let x = 1;
        let y = 1;
        for (let element of vectors) {
            x *= element.x;
            y *= element.y;
        }
        return x + y;
    }
}
