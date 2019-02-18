export default class BoxApp {
  constructor (canvasEl) {
    this.canvasEl = canvasEl
    this.width = canvasEl.width
    this.height = canvasEl.height
    this.ctx = canvasEl.getContext('2d')
    this.shapes = []
  }

  /**
   * @param {Shape} shape
   *
   * @return {this}
   */
  add (shape) {
    this.shapes.push(shape)

    return this
  }

  /**
   * @todo test me
   *
   * @returns {this}
   */
  update () {
    this.handleCollisions()
    this.handleSnapTos()

    return this
  }

  handleSnapTos () {
    console.log('To be implemented')
  }

  handleCollisions () {
    this.shapes.forEach((shape) => shape.resetCollisionState())

    const size = this.shapes.length

    for (let i = 0; i < size; i++) {
      let shapeA = this.shapes[i]

      for (let j = i + 1; j < size; j++) {
        let shapeB = this.shapes[j]

        if (shapeA.collidesWith(shapeB)) {
          shapeB.setInCollisionState()
          shapeA.setInCollisionState()
        }
      }
    }
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  draw () {
    this.clear()

    this.shapes.forEach((shape) => {
      shape.draw(this.ctx)
    })
  }
}
