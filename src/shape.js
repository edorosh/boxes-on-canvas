class Shape {
  static get defaultFillColor () {
    return '#AAAAAA'
  }

  static get collideFillColor () {
    return '#FF0000'
  }

  constructor (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.heigh = height
    this.fill = Shape.defaultFillColor
  }

  getX () {
    return this.x
  }

  getY () {
    return this.y
  }

  getWidth () {
    return this.width
  }

  getHeight () {
    return this.heigh
  }

  display (ctx) {
    ctx.fillStyle = this.fill
    ctx.fillRect(this.x, this.y, this.width, this.heigh)
  }

  collidesWith (otherShape) {
    return Shape.collides(this, otherShape)
  }

  /**
   * Detects if two Shape have collisions
   * @param {Shape} a
   * @param {Shape} b
   * @returns {boolean}
   */
  static collides (a, b) {
    return a.getX() < b.getX() + b.getWidth() &&
      a.getX() + a.getWidth() > b.getX() &&
      a.getY() < b.getY() + b.getHeight() &&
      a.getY() + a.getHeight() > b.getY()
  }
}

export default Shape
