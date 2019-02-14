export default class BoxApp {
  constructor (canvasEl) {
    this.shapeList = new Set()
    this.canvasEl = canvasEl
    this.ctx = null
  }

  /**
   * @param {Shape} shape
   *
   * @return {this}
   */
  add (shape) {
    this.shapeList.add(shape)

    return this
  }

  get size () {
    return this.shapeList.size
  }

  /**
   * @param {Shape} shape
   *
   * @returns {boolean}
   */
  has (shape) {
    return this.shapeList.has(shape)
  }

  draw () {
    for (let shape of this.shapeList) {
      shape.draw(this.ctx)
    }
  }
}
