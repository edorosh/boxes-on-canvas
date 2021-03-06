import Point from './point'
import Shape from './shape'
import CanvasEngine from './canvasEngine'

export default class BoxApp {
  constructor (canvasEl, options = {}) {
    this.canvasEl = canvasEl
    this.snapToOffset = options.snapToOffset || 0
    this.initialDragAndDropShapePoint = null
    this.fullViewportMode = false

    options.updateCallback = this.update.bind(this)

    this.canvasEngine = new CanvasEngine(canvasEl, options)

    this.setUpAppEvents()
  }

  static get collideColor () {
    return 'rgba(255,0,0,.6)'
  }

  /**
   * @param {Shape} shape
   *
   * @return {boolean}
   */
  static isInCollisionState (shape) {
    return shape.fill === BoxApp.collideColor
  }

  get shapes () {
    return this.canvasEngine.getShapes()
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

    this.forceRedrawScene()
  }

  setUpAppEvents () {
    window.onresize = this.setUpFullViewportMode.bind(this)

    this.canvasEl.addEventListener('canvas:shape-move-start', this.handleShapeMoveStart.bind(this))
    this.canvasEl.addEventListener('canvas:shape-move-stop', this.handleShapeMoveStop.bind(this))
    this.canvasEl.addEventListener('canvas:shape-move', this.handleShapeMove.bind(this))

    return this
  }

  handleShapeMoveStart (e) {
    const selectedShape = e.detail.shape

    if (selectedShape !== null) {
      this.initialDragAndDropShapePoint = {
        x: selectedShape.x,
        y: selectedShape.y
      }
    }
  }

  handleShapeMoveStop (e) {
    const selectedForDragAndDropShape = e.detail.shape

    if (selectedForDragAndDropShape !== null && this.initialDragAndDropShapePoint !== null) {
      if (BoxApp.isInCollisionState(selectedForDragAndDropShape)) {
        const initialPoint = this.initialDragAndDropShapePoint

        selectedForDragAndDropShape.x = initialPoint.x
        selectedForDragAndDropShape.y = initialPoint.y
        this.forceRedrawScene()
      }
    }

    this.initialDragAndDropShapePoint = null
  }

  handleShapeMove (e) {
    const selectedForDragAndDropShape = e.detail.shape
    const selectedForDragAndDropShapePoint = e.detail.selectedPoint

    if (!selectedForDragAndDropShape) {
      return
    }

    const size = this.shapes.length
    const point = e.detail.point

    selectedForDragAndDropShape.x = point.x - selectedForDragAndDropShapePoint.x
    selectedForDragAndDropShape.y = point.y - selectedForDragAndDropShapePoint.y

    this.forceRedrawScene()

    for (let i = 0; i < size; i++) {
      let shape = this.shapes[i]

      const initialPoint = new Point(
        selectedForDragAndDropShape.x,
        selectedForDragAndDropShape.y
      )

      if (selectedForDragAndDropShape.isStickableTo(shape, this.snapToOffset)) {
        selectedForDragAndDropShape.snapTo(shape)

        // get back if has collisions
        if (this.findCollisionsWith(selectedForDragAndDropShape)) {
          selectedForDragAndDropShape.x = initialPoint.x
          selectedForDragAndDropShape.y = initialPoint.y
        }
      }
    }
  }

  /**
   * Trigger Update and Redraw Scene on the next Animation tick
   */
  forceRedrawScene () {
    this.canvasEngine.forceRedrawScene()
  }

  /**
   * Add the given Shape on Canvas
   *
   * @param {Shape} shape
   *
   * @return {this}
   */
  add (shape) {
    this.canvasEngine.add(shape)

    return this
  }

  /**
   * Update Scene
   *
   * @returns {this}
   */
  update () {
    this.clearShapeState()
    this.handleCollisions()

    return this
  }

  /**
   * Clear fill color of all Shapes
   *
   * @param {Shape} shape
   */
  static resetShapeState (shape) {
    shape.fill = Shape.defaultFillColor
  }

  /**
   * Clear state of all Shapes on Canvas
   */
  clearShapeState () {
    this.shapes.forEach((shape) => BoxApp.resetShapeState(shape))
  }

  /**
   * Figure out if the given Shape collides with any other Shape
   *
   * @param {Shape} shape
   *
   * @return {boolean}
   */
  findCollisionsWith (shape) {
    const size = this.shapes.length

    for (let i = 0; i < size; i++) {
      let otherShape = this.shapes[i]

      // @refactor by explicit method
      if (Object.is(otherShape, shape)) {
        continue
      }

      if (otherShape.collidesWith(shape)) {
        return true
      }
    }

    return false
  }

  /**
   * Handle Shapes in collision state
   */
  handleCollisions () {
    const size = this.shapes.length

    for (let i = 0; i < size; i++) {
      let shapeA = this.shapes[i]

      for (let j = i + 1; j < size; j++) {
        let shapeB = this.shapes[j]

        if (shapeA.collidesWith(shapeB)) {
          shapeB.fill = BoxApp.collideColor
          shapeA.fill = BoxApp.collideColor
        }
      }
    }
  }

  /**
   * Trigger to draw and update Scene
   */
  run () {
    this.canvasEngine.run()
  }
}
