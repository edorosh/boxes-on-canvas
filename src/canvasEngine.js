import Point from './point'

export default class CanvasEngine {
  constructor (canvasEl, options = {}) {
    this.canvasEl = canvasEl
    this.ctx = canvasEl.getContext('2d')
    this.shapes = []
    this.updateCallback = options.updateCallback || null

    this.selectedForDragAndDropShape = null
    this.selectedForDragAndDropShapePoint = null
    this.redraw = true

    this.setUpEvents()
  }

  setUpEvents () {
    window.requestAnimationFrame(this.run.bind(this), this.canvasEl)

    this.canvasEl.addEventListener('mousedown', e => {
      const point = this.getMousePos(e)
      const selectedShape = this.getSelectedShape(point)

      if (selectedShape !== null) {
        this.selectedForDragAndDropShapePoint = new Point(
          point.x - selectedShape.x,
          point.y - selectedShape.y
        )

        this.selectedForDragAndDropShape = selectedShape

        this.canvasEl.dispatchEvent(
          new CustomEvent('canvas:shape-move-start', { detail: {
            'point': this.getMousePos(e),
            'shape': this.selectedForDragAndDropShape,
            'selectedPoint': this.selectedForDragAndDropShapePoint
          } })
        )
      }
    })

    this.canvasEl.addEventListener('mouseup', e => {
      this.canvasEl.dispatchEvent(
        new CustomEvent('canvas:shape-move-stop', { detail: {
          'point': this.getMousePos(e),
          'shape': this.selectedForDragAndDropShape,
          'selectedPoint': this.selectedForDragAndDropShapePoint
        } })
      )

      this.selectedForDragAndDropShape = null
      this.selectedForDragAndDropShapePoint = null
    })

    this.canvasEl.addEventListener('mousemove', e => {
      if (!this.selectedForDragAndDropShape) {
        return
      }

      this.canvasEl.dispatchEvent(
        new CustomEvent('canvas:shape-move', { detail: {
          'point': this.getMousePos(e),
          'shape': this.selectedForDragAndDropShape,
          'selectedPoint': this.selectedForDragAndDropShapePoint
        } })
      )
    })

    // this.canvasEl.addEventListener('click', (e) => {
    //   const point = this.getMousePos(e)
    //   const selectedShape = this.getSelectedShape(point)
    //
    //   if (selectedShape !== null) {
    //     this.canvasEl.dispatchEvent(
    //       new CustomEvent('canvas:shape-select', { detail: {
    //         'shape': selectedShape,
    //         'point': this.getMousePos(e)
    //       } })
    //     )
    //   }
    //
    //   this.canvasEl.dispatchEvent(
    //     new CustomEvent('canvas:click', { detail: {
    //       'point': this.getMousePos(e)
    //     } })
    //   )
    // })

    return this
  }

  forceRedraw () {
    this.redraw = true
  }

  /**
   * @param e
   * @return {Point}
   */
  getMousePos (e) {
    const rect = this.canvasEl.getBoundingClientRect()

    return new Point(e.clientX - rect.left, e.clientY - rect.top)
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
   * @todo use internal iterator
   */
  getShapes () {
    return this.shapes
  }

  /**
   * @todo test me
   *
   * @returns {this}
   */
  update () {
    if (this.updateCallback !== null) {
      this.updateCallback(this)
    }

    return this
  }

  /**
   * @param {Point} point
   * @return {(Shape|null)}
   */
  getSelectedShape (point) {
    const size = this.shapes.length

    for (let i = 0; i < size; i++) {
      let shape = this.shapes[i]

      if (shape.hasPoint(point)) {
        return shape
      }
    }

    return null
  }

  clear () {
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
  }

  run () {
    window.requestAnimationFrame(this.run.bind(this), this.canvasEl)

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
