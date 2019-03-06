export default class Shape {
  static get defaultFillColor () {
    return '#AAAAAA'
  }

  static get collideFillColor () {
    return 'rgba(255,0,0,.6)'
  }

  static get strokeColor () {
    return '#000000'
  }

  static get selectedColor () {
    return '#008000'
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
    this.height = height
    this.fill = Shape.defaultFillColor
    this.borderWidth = 1
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
    return this.height
  }

  getOffsetX () {
    return this.x + this.width
  }

  getOffsetY () {
    return this.y + this.height
  }

  /**
   * @todo test this more
   */
  setInCollisionState () {
    this.fill = Shape.collideFillColor
  }

  /**
   * @todo test this more
   * @return {boolean}
   */
  isInCollisionState () {
    return this.fill === Shape.collideFillColor
  }

  /**
   * @todo test this more
   */
  setSelectedState () {
    this.fill = Shape.selectedColor
  }

  /**
   * @todo test this more
   */
  resetState () {
    this.fill = Shape.defaultFillColor
  }

  /**
   * @todo test this more
   *
   * @param ctx
   */
  draw (ctx) {
    ctx.save()

    ctx.fillStyle = this.fill
    ctx.fillRect(this.x, this.y, this.width, this.height)

    ctx.strokeStyle = Shape.strokeColor
    ctx.lineWidth = this.borderWidth
    ctx.strokeRect(this.x, this.y, this.width, this.height)

    ctx.restore()
  }

  /**
   * @todo add unit test / move to static
   */
  containsPoint (point) {
    return (this.x <= point.x && this.getOffsetX() >= point.x) &&
      (this.y <= point.y && this.getOffsetY() >= point.y)
  }

  collidesWith (otherShape) {
    return Shape.collides(this, otherShape)
  }

  bordersWith (otherShape) {
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
   * Snaps a shape to other Shape
   *
   * @param {Shape} snapToShape
   *
   * @throws Error In case of shape collisions
   *
   * @todo add more meaningful exception class
   */
  snapTo (snapToShape) {
    if (this.collidesWith(snapToShape)) {
      throw new Error('Snap to shape being in collision is not supported!')
    }

    const borderOffset = 0

    // shift left
    if (snapToShape.getOffsetX() < this.getX()) {
      this.x = snapToShape.getOffsetX() + borderOffset
    }

    // shift right
    if (this.getOffsetX() < snapToShape.getX()) {
      this.x = snapToShape.getX() - this.getWidth() - borderOffset
    }

    // shift down
    if (this.getOffsetY() < snapToShape.getY()) {
      this.y = snapToShape.getY() - this.getHeight() - borderOffset
    }

    // shift up
    if (snapToShape.getOffsetY() < this.getY()) {
      this.y = snapToShape.getOffsetY() + borderOffset
    }
  }

  toString () {
    return `Shape(${this.x}, ${this.y}, ${this.width}, ${this.height}, ${this.fill})`
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
   * Detects if two Shape have collisions or border with each other
   *
   * @param {Shape} a
   * @param {Shape} b
   *
   * @returns {boolean}
   */
  static collideOrBorder (a, b) {
    return (a.getX() <= b.getOffsetX() && a.getOffsetX() >= b.getX()) &&
      (a.getY() <= b.getOffsetY() && a.getOffsetY() >= b.getY())
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
        (a.getX() < b.getOffsetX() && a.getOffsetX() > b.getX()) &&
        (a.getY() < b.getOffsetY() && a.getOffsetY() > b.getY())
      )
  }

  /**
   * Detects if two Shape can be glued together
   *
   * @param {Shape} a
   * @param {Shape} b
   * @param {int} stickyOffset
   *
   * @returns {boolean}
   *
   * @throws Error Missing arguments
   */
  static areStickable (a, b, stickyOffset) {
    if (stickyOffset === undefined) {
      throw new Error('Offset is undefined!')
    }

    if (a.collidesWith(b)) {
      return false
    }

    const boostedShape = new Shape(
      b.getX() - stickyOffset,
      b.getY() - stickyOffset,
      b.getWidth() + stickyOffset * 2,
      b.getHeight() + stickyOffset * 2
    )

    return Shape.collideOrBorder(a, boostedShape)
  }
}
