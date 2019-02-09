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
    return (a.getX() < b.getOffsetX() && a.getOffsetX() > b.getX()) ||
      (a.getY() < b.getOffsetY() && a.getOffsetY() > b.getY())
  }

  /**
   * Detects if two Shape can be glued together
   *
   * @param {Shape} shapeToBeSticked
   * @param {Shape} shape
   * @param {int} stickyOffset
   *
   * @returns {boolean}
   */
  static areStickable (shapeToBeSticked, shape, stickyOffset) {
    stickyOffset++

    /**
     * @type {Shape[]}
     */
    let shiftedShapeList = [
      new Shape(
        shape.getX(),
        shape.getY() + stickyOffset,
        shape.getWidth(),
        shape.getHeight()
      ),
      new Shape(
        shape.getX() + stickyOffset,
        shape.getY(),
        shape.getWidth(),
        shape.getHeight()
      )
    ]

    if (shape.getX() - stickyOffset > 0) {
      shiftedShapeList.push(
        new Shape(
          shape.getX() - stickyOffset,
          shape.getY(),
          shape.getWidth(),
          shape.getHeight()
        )
      )
    }

    if (shape.getY() - stickyOffset > 0) {
      shiftedShapeList.push(
        new Shape(
          shape.getX(),
          shape.getY() - stickyOffset,
          shape.getWidth(),
          shape.getHeight()
        )
      )
    }

    for (let shiftedShape of shiftedShapeList) {
      if (shiftedShape.collidesWith(shapeToBeSticked)) {
        return true
      }
    }

    return false
  }
}
