export default class BoxApp {
  constructor (canvasEl, options = {}) {
    this.canvasEl = canvasEl
    this.width = canvasEl.width
    this.height = canvasEl.height
    this.ctx = canvasEl.getContext('2d')
    this.shapes = []
    this.snapToOffset = options.snapToOffset || 0
    this.redraw = true
    this.selectedForDragAndDropShape = null
    this.selectedForDragAndDropShapeOffset = null
    this.initialDragAndDropPoint = null
  }

  setUpEvents () {
    window.requestAnimationFrame(this.run.bind(this), this.canvasEl);

    this.canvasEl.addEventListener('mousedown', e => {
      const point = this.getMousePos(e)
      const selectedShape = this.getSelectedShape(point)

      if (selectedShape !== null) {
        this.initialDragAndDropPoint = {
          x: selectedShape.x,
          y: selectedShape.y
        }

        // @todo add abstraction
        this.selectedForDragAndDropShapeOffset = {
          x: point.x - selectedShape.x,
          y: point.y - selectedShape.y
        }

        // @todo replace by behaviour(method)
        this.selectedForDragAndDropShape = selectedShape
      }

      // console.log('mouseup ', point, ' ', this.selectedForDragAndDropShape)
    })

    this.canvasEl.addEventListener('mouseup', e => {
      if (this.selectedForDragAndDropShape !== null && this.initialDragAndDropPoint !== null) {
        if (this.selectedForDragAndDropShape.isInCollisionState()) {
          // @todo add animation
          this.selectedForDragAndDropShape.x = this.initialDragAndDropPoint.x
          this.selectedForDragAndDropShape.y = this.initialDragAndDropPoint.y
        }
      }

      // @todo replace by behaviour(method)
      this.selectedForDragAndDropShape = null
      this.initialDragAndDropPoint = null

      // @todo add AOP
      // console.log('mousedown ', this.selectedForDragAndDropShape)
    })

    this.canvasEl.addEventListener('mousemove', e => {
      const point = this.getMousePos(e)
      if (this.selectedForDragAndDropShape !== null) {

        this.selectedForDragAndDropShape.x = point.x - this.selectedForDragAndDropShapeOffset.x
        this.selectedForDragAndDropShape.y = point.y - this.selectedForDragAndDropShapeOffset.y

        this.forceRedraw()
      }
      // const selectedShape = this.getSelectedShape(point)
      // console.log('mouseup ', point, ' ', this.selectedForDragAndDropShape)
    })

    this.canvasEl.addEventListener('click', (e) => {
      const point = this.getMousePos(e)

      const selectedShape = this.getSelectedShape(point)

      // @todo fire event
      if (selectedShape !== null) {
        selectedShape.setSelectedState()
      }

      this.forceRedraw()
    })

    return this
  }

  forceRedraw () {
    this.redraw = true
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
    this.forceRedraw()

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

  clearShapeState () {
    this.shapes.forEach((shape) => shape.resetState())
  }

  // @todo probably add static here
  getSelectedShape (point) {
    const size = this.shapes.length

    for (let i = 0; i < size; i++) {
      let shape = this.shapes[i]

      if (shape.containsPoint(point)) {
        return shape
      }
    }

    return null
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

  run () {
    if (this.redraw !== false) {
      console.log('run')
      this.update()
      this.draw()
    }

    this.redraw = false

    window.requestAnimationFrame(this.run.bind(this))
  }

  draw () {
    console.log('redraw frame')

    this.clear()

    this.shapes.forEach((shape) => {
      shape.draw(this.ctx)
    })
  }
}
