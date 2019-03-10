/**
 * @todo Add internal classes to make private methods
 */
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
    this.fullViewportMode = false
    this.animation = []
    this.useAnimation = options.useAnimation || false

    this.setUpEvents()
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

  static getViewportDimensionsForElement (element) {
    return {
      width: window.innerWidth - element.offsetLeft * 2,
      height: window.innerHeight - element.offsetTop * 2
    }
  }

  setUpFullViewportMode () {
    if (!this.fullViewportMode) {
      return
    }

    const dimensions = BoxApp.getViewportDimensionsForElement(this.canvasEl)

    this.canvasEl.width = dimensions.width
    this.canvasEl.height = dimensions.height

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

          // console.log(ax, by, c)

          if (this.useAnimation) {
            this.animation.push(
              (function * () {
                while (shape.x !== initialPoint.x || shape.y !== initialPoint.y) {
                  const step = 3

                  // @todo refactor this
                  // move X
                  if (shape.y === initialPoint.y) {
                    if (shape.x < initialPoint.x) {
                      shape.x += step
                      shape.x = (shape.x > initialPoint.x && initialPoint.x) || shape.x
                    } else {
                      shape.x -= step
                      shape.x = (shape.x < initialPoint.x && initialPoint.x) || shape.x
                    }
                  } else if (shape.x === initialPoint.x) {
                    // move Y
                    if (shape.y < initialPoint.y) {
                      shape.y += step
                      shape.y = (shape.y > initialPoint.y && initialPoint.y) || shape.y
                    } else {
                      shape.y -= step
                      shape.y = (shape.y < initialPoint.y && initialPoint.y) || shape.y
                    }
                  } else {
                    // move both
                    if (shape.y < initialPoint.y) {
                      shape.y += step
                      shape.y = (shape.y > initialPoint.y && initialPoint.y) || shape.y
                    } else {
                      shape.y -= step
                      shape.y = (shape.y < initialPoint.y && initialPoint.y) || shape.y
                    }
                    shape.x = (-c - by * shape.y) / ax
                  }

                  self.forceRedraw()
                  yield
                }
              })()
            )
          } else {
            shape.x = initialPoint.x
            shape.y = initialPoint.y
            self.forceRedraw()
          }
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

      const size = this.shapes.length
      const point = this.getMousePos(e)

      if (this.selectedForDragAndDropShape !== null) {
        this.selectedForDragAndDropShape.x = point.x - this.selectedForDragAndDropShapeOffset.x
        this.selectedForDragAndDropShape.y = point.y - this.selectedForDragAndDropShapeOffset.y

        this.forceRedraw()
      }

      // console.log('mouseup ', point, ' ', this.selectedForDragAndDropShape)

      // @todo disable snap to during animation
      for (let i = 0; i < size; i++) {
        let shape = this.shapes[i]

        const initialPoint = {
          x: this.selectedForDragAndDropShape.getX(),
          y: this.selectedForDragAndDropShape.getY()
        }

        if (this.selectedForDragAndDropShape.isStickableTo(shape, this.snapToOffset)) {
          this.selectedForDragAndDropShape.snapTo(shape)

          // get back if has collisions
          if (this.findCollisionsWith(this.selectedForDragAndDropShape)) {
            this.selectedForDragAndDropShape.x = initialPoint.x
            this.selectedForDragAndDropShape.y = initialPoint.y
          } else {
            this.forceRedraw()
            // @todo end up the loop if first found
          }
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

  handleAnimation () {
    if (!this.animation.length) {
      return
    }

    this.animation.forEach(function (animation, index, object) {
      let next = animation.next()

      if (next.done) {
        object.splice(index, 1)
      }
    })
  }

  /**
   * @tod add unit test
   * @param {Shape} shape
   * @return {boolean}
   */
  findCollisionsWith(shape) {
    const size = this.shapes.length

    for (let i = 0; i < size; i++) {
      let otherShape = this.shapes[i]

      // @refactor by explicit method
      if (Object.is(otherShape, shape)) {
        continue
      }

      if (otherShape.collidesWith(shape)) {
        return true;
      }
    }

    return false;
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

    this.handleAnimation()

    if (this.redraw !== false) {
      // console.log('run')
      this.update()
      this.draw()
    }

    this.redraw = false
  }

  draw () {
    // console.log('redraw frame')

    this.clear()

    this.shapes.forEach((shape) => {
      shape.draw(this.ctx)
    })
  }
}
