import Point from './point'

export default class CanvasEngine {
  constructor (canvasEl, options = {}) {
    this.canvasEl = canvasEl
    this.ctx = canvasEl.getContext('2d')
    this.shapes = []

    this.draggableShape = null
    this.draggableShapeClickPoint = null

    this.redrawScene = true

    this.updateCallback = options.updateCallback || null

    this.setUpEngineEvents()
  }

  setUpEngineEvents () {
    window.requestAnimationFrame(this.run.bind(this), this.getCanvasElement())

    this.canvasEl.addEventListener('mousedown', e => {
      this.handleShapeMoveStart(CanvasEngine.createPointFromMouseEvent(e))
    })

    this.canvasEl.addEventListener('mouseup', e => {
      this.handleShapeMoveStop(CanvasEngine.createPointFromMouseEvent(e))
    })

    this.canvasEl.addEventListener('mousemove', e => {
      this.handleShapeMove(CanvasEngine.createPointFromMouseEvent(e))
    })
  }

  getCanvasElement () {
    return this.canvasEl
  }

  /**
   * @param {Point} eventPoint
   */
  handleShapeMoveStart (eventPoint) {
    const mousePoint = this.getMousePositionByPoint(eventPoint)
    const selectedShape = this.getSelectedShape(mousePoint)

    if (selectedShape !== null) {
      this.draggableShapeClickPoint = new Point(
        mousePoint.x - selectedShape.x,
        mousePoint.y - selectedShape.y
      )

      this.draggableShape = selectedShape

      this.canvasEl.dispatchEvent(
        new CustomEvent('canvas:shape-move-start', { detail: {
          'point': mousePoint,
          'shape': this.draggableShape,
          'selectedPoint': this.draggableShapeClickPoint
        } })
      )
    }
  }

  /**
   * @param {Point} eventPoint
   */
  handleShapeMoveStop (eventPoint) {
    this.canvasEl.dispatchEvent(
      new CustomEvent('canvas:shape-move-stop', { detail: {
        'point': this.getMousePositionByPoint(eventPoint),
        'shape': this.draggableShape,
        'selectedPoint': this.draggableShapeClickPoint
      } })
    )

    this.draggableShape = null
    this.draggableShapeClickPoint = null
  }

  getDraggableShape () {
    return this.draggableShape
  }

  getDraggableShapeClickPoint () {
    return this.draggableShapeClickPoint
  }

  /**
   * @param {Point} eventPoint
   */
  handleShapeMove (eventPoint) {
    if (!this.draggableShape) {
      return
    }

    this.canvasEl.dispatchEvent(
      new CustomEvent('canvas:shape-move', { detail: {
        'point': this.getMousePositionByPoint(eventPoint),
        'shape': this.draggableShape,
        'selectedPoint': this.draggableShapeClickPoint
      } })
    )
  }

  /**
   * Make next Animation Frame calling run method
   */
  forceRedrawScene () {
    this.redrawScene = true
  }

  /**
   * @param mouseEvent
   *
   * @returns {Point}
   */
  static createPointFromMouseEvent (mouseEvent) {
    return new Point(mouseEvent.clientX, mouseEvent.clientY)
  }

  /**
   * @param {Point} eventPoint
   *
   * @return {Point}
   */
  getMousePositionByPoint (eventPoint) {
    const rect = this.canvasEl.getBoundingClientRect()

    return new Point(eventPoint.x - rect.left, eventPoint.y - rect.top)
  }

  /**
   * Add the given Shape to the Canvas
   *
   * @param {Shape} shape
   *
   * @return {this}
   */
  add (shape) {
    this.shapes.push(shape)
    this.forceRedrawScene()

    return this
  }

  /**
   * @todo use internal iterator
   */
  getShapes () {
    return this.shapes
  }

  /**
   * Run update Scene callback
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
   * Returns the Shape being clicked on
   *
   * @param {Point} point
   *
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

  /**
   * Clear full Scene on the Canvas
   */
  clear () {
    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height)
  }

  /**
   * Run Scene Update and Draw
   */
  run () {
    window.requestAnimationFrame(this.run.bind(this), this.getCanvasElement())

    if (this.redrawScene !== false) {
      // console.log('run')
      this.update()
      this.draw()
    }

    this.redrawScene = false
  }

  /**
   * Draw Scene
   */
  draw () {
    // console.log('redrawScene frame')

    this.clear()

    this.shapes.forEach((shape) => {
      shape.draw(this.ctx)
    })
  }
}
