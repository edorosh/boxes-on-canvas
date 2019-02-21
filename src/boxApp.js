export default class BoxApp {
  constructor (canvasEl, options = {}) {
    this.canvasEl = canvasEl
    this.width = canvasEl.width
    this.height = canvasEl.height
    this.ctx = canvasEl.getContext('2d')
    this.shapes = []
    this.snapToOffset = options.snapToOffset || 0
    this.redraw = true
  }

  setUpEvents () {
    window.requestAnimationFrame(this.draw.bind(this), this.canvasEl);
    // canvas.addEventListener('mouseup',);
    // canvas.addEventListener('mousemove',);
    // canvas.addEventListener('mousedown',);

    this.canvasEl.addEventListener('click', (e) => {
      const point = this.getMousePos(e)
      const size = this.shapes.length

      this.update()

      for (let i = 0; i < size; i++) {
        let shape = this.shapes[i]

        if (shape.containsPoint(point)) {
          shape.setSelectedState()
        }
      }

      this.redraw = true
    })

    return this
  }

  getMousePos (e) {
    const rect = this.canvasEl.getBoundingClientRect()

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }


  /**
   * @param {Shape} shape
   *
   * @return {this}
   */
  add (shape) {
    this.shapes.push(shape)
    this.update()
    this.redraw = true

    return this
  }

  /**
   * @todo test me
   *
   * @returns {this}
   */
  update () {
    this.clearShapeState()
    this.handleSnapTos()
    this.handleCollisions()

    return this
  }

  clearShapeState() {
    this.shapes.forEach((shape) => shape.resetState())
  }

  handleSnapTos () {
    const size = this.shapes.length

    for (let i = 0; i < size; i++) {
      let shapeA = this.shapes[i]

      for (let j = i + 1; j < size; j++) {
        let shapeB = this.shapes[j]

        if (shapeB.isStickableTo(shapeA, this.snapToOffset)) {
          shapeB.snapTo(shapeA)
        }
      }
    }
  }

  handleCollisions () {
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
    if (this.redraw === false) {
      window.requestAnimationFrame(this.draw.bind(this))
      return
    }

    console.log('redraw frame')

    this.clear()

    this.shapes.forEach((shape) => {
      shape.draw(this.ctx)
    })

    this.redraw = false

    window.requestAnimationFrame(this.draw.bind(this))
  }
}
