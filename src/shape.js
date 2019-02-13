export default class Shape {
  static get defaultFillColor () {
    return '#AAAAAA'
  }

  static get collideFillColor () {
    return '#FF0000'
  }

  /**
   * @param {int} x
   * @param {int} y
   * @param {int} width
   * @param {int} height
   */
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

  getOffsetX () {
    return this.x + this.width
  }

  getOffsetY () {
    return this.y + this.heigh
  }

  display (ctx) {
    ctx.fillStyle = this.fill
    ctx.fillRect(this.x, this.y, this.width, this.heigh)
  }

  collidesWith (otherShape) {
    return Shape.collides(this, otherShape)
  }

  bordersWith(otherShape) {
    return Shape.borders(this, otherShape)
  }

  /**
   * Detects if Other Shape sticks to the current
   *
   * @param {Shape} otherShape
   * @param stickyOffset
   */
  isStickableTo (otherShape, stickyOffset) {
    return Shape.areStickable(this, otherShape, stickyOffset)
  }

  /**
   * Detects if two Shape have collisions
   *
   * @param {Shape} a
   * @param {Shape} b
   *
   * @returns {boolean}
   */
  static collides (a, b) {
    return (a.getX() < b.getOffsetX() && a.getOffsetX() > b.getX()) &&
      (a.getY() < b.getOffsetY() && a.getOffsetY() > b.getY())
  }

  /**
   * Detects if two Shape can be glued together
   *
   * @param {Shape} a
   * @param {Shape} b
   * @param {int} stickyOffset
   *
   * @returns {boolean}
   */
  static areStickable (a, b, stickyOffset) {
    const boostedShape = new Shape(
      b.getX() - stickyOffset,
      b.getY() - stickyOffset,
      b.getWidth() + stickyOffset * 2,
      b.getHeight() + stickyOffset * 2
    )

    return (boostedShape.getX() <= a.getOffsetX() && boostedShape.getOffsetX() >= a.getX()) &&
      (boostedShape.getY() <= a.getOffsetY() && boostedShape.getOffsetY() >= a.getY())
  }

  /**
   *
   * @param {Shape} a
   * @param {Shape} b
   *
   * @returns {boolean}
   */
  static borders (a, b) {
    return (a.getX() <= b.getOffsetX() && a.getOffsetX() >= b.getX()) &&
      (a.getY() <= b.getOffsetY() && a.getOffsetY() >= b.getY()) &&
      !(
        (a.getOffsetX() > b.getX() && a.getX() < b.getOffsetX()) &&
        (a.getOffsetY() > b.getY() && a.getY() < b.getOffsetY())
      )
  }

  toString () {
    return `Shape(${this.x}, ${this.y}, ${this.width}, ${this.heigh}, ${this.fill})`
  }
}
