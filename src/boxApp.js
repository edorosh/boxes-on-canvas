export default class BoxApp {
  constructor (canvasEl, options = {}) {
    this.canvasEl = canvasEl
    this.ctx = canvasEl.getContext('2d')
    this.shapes = []
    this.snapToOffset = options.snapToOffset || 0
    this.redraw = true
    this.selectedForDragAndDropShape = null
    this.selectedForDragAndDropShapeOffset = null
    this.initialDragAndDropPoint = null
    this.generator = null
    this.fullViewportMode = false
  }

  get canvasHeight () {
    return this.canvasEl.height
  }

  get canvasWidth () {
    return this.canvasEl.width
  }

  /**
   * @return {this}
   */
  enterFullViewportMode () {
    this.fullViewportMode = true
    this.setUpFullViewportMode()
    return this
  }

  setUpFullViewportMode () {
    if (!this.fullViewportMode) {
      return
    }

    this.canvasEl.width = window.innerWidth - this.canvasEl.offsetLeft * 2
    this.canvasEl.height = window.innerHeight - this.canvasEl.offsetTop * 2

    this.forceRedraw()
  }

  setUpEvents () {
    window.requestAnimationFrame(this.run.bind(this), this.canvasEl)
    window.onresize = this.setUpFullViewportMode.bind(this)

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
          const self = this
          const shape = this.selectedForDragAndDropShape
          const initialPoint = this.initialDragAndDropPoint

          // get line
          const ax = this.initialDragAndDropPoint.y - this.selectedForDragAndDropShape.y
          const by = this.selectedForDragAndDropShape.x - this.initialDragAndDropPoint.x
          const c = this.initialDragAndDropPoint.x * this.selectedForDragAndDropShape.y - this.selectedForDragAndDropShape.x * this.initialDragAndDropPoint.y

          console.log(ax, by, c)

          // animation
          this.generator = (function * () {
            while (shape.x !== initialPoint.x || shape.y !== initialPoint.y) {
              const step = 3

              // @todo refactor this
              // move X
              if (shape.y === initialPoint.y) {
                if (shape.x < initialPoint.x) {
                  shape.x += step
                  shape.x = shape.x > initialPoint.x && initialPoint.x || shape.x
                } else {
                  shape.x -= step
                  shape.x = shape.x < initialPoint.x && initialPoint.x || shape.x
                }
              } else if (shape.x === initialPoint.x) {
                // move Y
                if (shape.y < initialPoint.y) {
                  shape.y += step
                  shape.y = shape.y > initialPoint.y && initialPoint.y || shape.y
                } else {
                  shape.y -= step
                  shape.y = shape.y < initialPoint.y && initialPoint.y || shape.y
                }
              }
              else {
                // move both
                if (shape.y < initialPoint.y) {
                  shape.y += step
                  shape.y = shape.y > initialPoint.y && initialPoint.y || shape.y
                } else {
                  shape.y -= step
                  shape.y = shape.y < initialPoint.y && initialPoint.y || shape.y
                }
                shape.x = (-c - by * shape.y) / ax
              }

              self.forceRedraw()
              yield
            }
          })()
        }
      }

      // @todo replace by behaviour(method)
      this.selectedForDragAndDropShape = null
      this.initialDragAndDropPoint = null

      // @todo add AOP
      // console.log('mousedown ', this.selectedForDragAndDropShape)
    })

    this.canvasEl.addEventListener('mousemove', e => {
      if (!this.selectedForDragAndDropShape) {
        return
      }

      const point = this.getMousePos(e)

      if (this.selectedForDragAndDropShape !== null) {

        this.selectedForDragAndDropShape.x = point.x - this.selectedForDragAndDropShapeOffset.x
        this.selectedForDragAndDropShape.y = point.y - this.selectedForDragAndDropShapeOffset.y

        this.forceRedraw()
      }

      console.log('mouseup ', point, ' ', this.selectedForDragAndDropShape)

      const size = this.shapes.length

      for (let i = 0; i < size; i++) {
        let shape = this.shapes[i]
        if (this.selectedForDragAndDropShape.isStickableTo(shape, this.snapToOffset)) {
          this.selectedForDragAndDropShape.snapTo(shape)
        }
      }
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
    // this.handleSnapTos()
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

  handleGenerator () {
    if (this.generator === null) {
      return
    }

    let next = this.generator.next()

    if (next.done) {
      this.generator = null
    }
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
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  run () {
    window.requestAnimationFrame(this.run.bind(this))

    this.handleGenerator()

    if (this.redraw !== false) {
      console.log('run')
      this.update()
      this.draw()

    }

    this.redraw = false
  }

  draw () {
    console.log('redraw frame')

    this.clear()

    this.shapes.forEach((shape) => {
      shape.draw(this.ctx)
    })
  }
}
