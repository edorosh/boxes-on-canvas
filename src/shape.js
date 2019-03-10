import Point from './point'

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
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor (x, y, width, height) {
    this.point = new Point(x, y)
    this.width = width
    this.height = height
    this.fill = Shape.defaultFillColor
    this.borderWidth = 1
  }

  /**
   * @return {number}
   */
  get x () {
    return this.point.x
  }

  /**
   * @param {number} x
   *
   * @return {number}
   */
  set x (x) {
    this.point = new Point(x, this.y)
  }

  /**
   * @return {number}
   */
  get y () {
    return this.point.y
  }

  /**
   * @param {number} y
   *
   * @return {number}
   */
  set y (y) {
    this.point = new Point(this.x, y)
  }

  /**
   * @return {number}
   */
  getWidth () {
    return this.width
  }

  /**
   * @return {number}
   */
  getHeight () {
    return this.height
  }

  /**
   * @return {number}
   */
  getOffsetX () {
    return this.x + this.width
  }

  /**
   * @return {number}
   */
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
   * @param {Point} point
   */
  hasPoint (point) {
    return Shape.containsPoint(this, point)
  }

  /**
   * @param {Shape} otherShape
   *
   * @return {boolean}
   */
  collidesWith (otherShape) {
    return Shape.collides(this, otherShape)
  }

  /**
   * @param {Shape} otherShape
   *
   * @return {boolean}
   */
  bordersWith (otherShape) {
    return Shape.borders(this, otherShape)
  }

  /**
   * Detects if Other Shape sticks to the current
   *
   * @param {Shape} otherShape
   * @param {number} stickyOffset
   *
   * @return {boolean}
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
   */
  snapTo (snapToShape) {
    if (this.collidesWith(snapToShape)) {
      throw new Error('Snap to shape being in collision is not supported!')
    }

    const borderOffset = 0

    // shift left
    if (snapToShape.getOffsetX() < this.x) {
      this.x = snapToShape.getOffsetX() + borderOffset
    }

    // shift right
    if (this.getOffsetX() < snapToShape.x) {
      this.x = snapToShape.x - this.getWidth() - borderOffset
    }

    // shift down
    if (this.getOffsetY() < snapToShape.y) {
      this.y = snapToShape.y - this.getHeight() - borderOffset
    }

    // shift up
    if (snapToShape.getOffsetY() < this.y) {
      this.y = snapToShape.getOffsetY() + borderOffset
    }
  }

  /**
   * @return {string}
   */
  toString () {
    return `Shape(${this.x}, ${this.y}, ${this.width}, ${this.height}, ${this.fill})`
  }

  /**
   * Detects if a Point is inside the given Shape
   *
   * @param {Shape} shape
   * @param {Point} point
   *
   * @returns {boolean}
   */
  static containsPoint (shape, point) {
    return (shape.x <= point.x && shape.getOffsetX() >= point.x) &&
      (shape.y <= point.y && shape.getOffsetY() >= point.y)
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
    return (a.x < b.getOffsetX() && a.getOffsetX() > b.x) &&
      (a.y < b.getOffsetY() && a.getOffsetY() > b.y)
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
    return (a.x <= b.getOffsetX() && a.getOffsetX() >= b.x) &&
      (a.y <= b.getOffsetY() && a.getOffsetY() >= b.y)
  }

  /**
   *
   * @param {Shape} a
   * @param {Shape} b
   *
   * @returns {boolean}
   */
  static borders (a, b) {
    return (a.x <= b.getOffsetX() && a.getOffsetX() >= b.x) &&
      (a.y <= b.getOffsetY() && a.getOffsetY() >= b.y) &&
      !(
        (a.x < b.getOffsetX() && a.getOffsetX() > b.x) &&
        (a.y < b.getOffsetY() && a.getOffsetY() > b.y)
      )
  }

  /**
   * Detects if two Shape can be glued together
   *
   * @param {Shape} a
   * @param {Shape} b
   * @param {number} stickyOffset
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
      b.x - stickyOffset,
      b.y - stickyOffset,
      b.getWidth() + stickyOffset * 2,
      b.getHeight() + stickyOffset * 2
    )

    return Shape.collideOrBorder(a, boostedShape)
  }
}
