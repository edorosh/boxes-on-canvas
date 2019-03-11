import Point from './point'
import Shape from './shape'
import CanvasEngine from './canvasEngine'

export default class BoxApp {
  constructor (canvasEl, options = {}) {
    this.canvasEl = canvasEl
    this.ctx = canvasEl.getContext('2d')
    this.snapToOffset = options.snapToOffset || 0
    this.selectedForDragAndDropShape = null
    this.selectedForDragAndDropShapePoint = null
    this.initialDragAndDropPoint = null
    this.fullViewportMode = false

    options.updateCallback = this.update.bind(this)

    this.canvasEngine = new CanvasEngine(canvasEl, options)

    this.setUpEvents()
  }

  static get collideColor () {
    return 'rgba(255,0,0,.6)'
  }

  static get selectedColor () {
    return '#008000'
  }

  /**
   * @todo test this more
   * @param {Shape} shape
   *
   * @return {boolean}
   */
  static isInCollisionState (shape) {
    return shape.fill === BoxApp.collideColor
  }

  get shapes() {
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

    this.forceRedraw()
  }

  setUpEvents () {
    window.onresize = this.setUpFullViewportMode.bind(this)

    this.canvasEl.addEventListener('canvas:shape-select', e => {
      const selectedShape = e.detail.shape
      this.initialDragAndDropPoint = e.detail.initialPoint
      this.selectedForDragAndDropShapePoint = e.detail.selectedPoint

      selectedShape.fill = BoxApp.selectedColor

      this.forceRedraw()
    })

    // this.canvasEl.addEventListener('canvas:shape-move-stop', e => {
    //   if (this.selectedForDragAndDropShape !== null && this.initialDragAndDropPoint !== null) {
    //     if (BoxApp.isInCollisionState(this.selectedForDragAndDropShape)) {
    //       const self = this
    //       const shape = this.selectedForDragAndDropShape
    //       const initialPoint = this.initialDragAndDropPoint
    //
    //       shape.x = initialPoint.x
    //       shape.y = initialPoint.y
    //       self.forceRedraw()
    //     }
    //   }
    // })
    //
    this.canvasEl.addEventListener('canvas:shape-move', e => {
      if (!this.selectedForDragAndDropShape) {
        return
      }

      const size = this.shapes.length
      const point = e.detail.point

      if (this.selectedForDragAndDropShape !== null) {
        this.selectedForDragAndDropShape.x = point.x - this.selectedForDragAndDropShapePoint.x
        this.selectedForDragAndDropShape.y = point.y - this.selectedForDragAndDropShapePoint.y

        this.forceRedraw()
      }

      for (let i = 0; i < size; i++) {
        let shape = this.shapes[i]

        const initialPoint = new Point(
          this.selectedForDragAndDropShape.x,
          this.selectedForDragAndDropShape.y
        )

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

    return this
  }

  forceRedraw () {
    this.canvasEngine.forceRedraw()
  }

  /**
   * @param {Shape} shape
   *
   * @return {this}
   */
  add (shape) {
    this.canvasEngine.add(shape)

    return this
  }

  /**
   * @todo test me
   *
   * @returns {this}
   */
  update () {
    // this.clearShapeState()
    this.handleCollisions()

    return this
  }

  /**
   * @param {Shape} shape
   */
  static resetShapeState (shape) {
    shape.fill = Shape.defaultFillColor
  }

  clearShapeState () {
    this.shapes.forEach((shape) => BoxApp.resetShapeState(shape))
  }

  /**
   * @tod add unit test
   * @param {Shape} shape
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

  draw () {
    this.canvasEngine.draw()
  }
}
