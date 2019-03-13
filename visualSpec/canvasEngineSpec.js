describe('Shape Interactions', function () {
  let canvasEngine; let canvasEl; let canvasCounter = 1; let canvasRect

  beforeAll(function () {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<p>Canvas samples</p>')
  })

  beforeEach(function () {
    this.canvasSelector = `canvas-${canvasCounter}`

    var fixture = `<canvas id="${this.canvasSelector}" width="300" height="280"> 
    This text is displayed if your browser does not support HTML5 Canvas. 
    </canvas>`

    document.body.insertAdjacentHTML(
      'beforeend',
      fixture)

    canvasEl = document.querySelector('#' + this.canvasSelector)
    canvasEngine = new CanvasEngine(canvasEl)
    canvasRect = canvasEl.getBoundingClientRect()
  })

  afterEach(function () {
    // document.body.removeChild(document.getElementById(`${this.canvasSelector}`));
    canvasCounter++
  })

  // @todo add test on mouse move

  it('should select the Shape on mouse down', () => {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, shape1.getOffsetY() + 1, 80, 80)

    canvasEngine
      .add(shape1)
      .add(shape2)
      .run()

    const mousePointOnCanvas = {
      x: 52,
      y: 52
    }

    const eventDown = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: mousePointOnCanvas.x + canvasRect.left,
      clientY: mousePointOnCanvas.y + canvasRect.top
    })

    const eventUp = new MouseEvent('mouseup', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: mousePointOnCanvas.x + canvasRect.left,
      clientY: mousePointOnCanvas.y + canvasRect.top
    })

    canvasEl.dispatchEvent(eventDown)
    canvasEngine.run()

    let clickPoint = canvasEngine.getDraggableShapeClickPoint()

    expect(clickPoint).not.toBeNull()
    expect(clickPoint.x).toBe(mousePointOnCanvas.x - shape1.x)
    expect(clickPoint.y).toBe(mousePointOnCanvas.y - shape1.y)

    expect(canvasEngine.getDraggableShape()).toBe(shape1)

    canvasEl.dispatchEvent(eventUp)
    canvasEngine.run()

    expect(canvasEngine.getDraggableShape()).toBeNull()
    expect(canvasEngine.getDraggableShapeClickPoint()).toBeNull()
  })

  it('should not select any Shape on mouse down', () => {
    const shape1 = new Shape(10, 10, 80, 80)

    canvasEngine
      .add(shape1)
      .run()

    const eventDown = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 100,
      clientY: 100
    })

    const eventUp = new MouseEvent('mouseup', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 100,
      clientY: 100
    })

    canvasEl.dispatchEvent(eventDown)
    canvasEngine.run()

    expect(canvasEngine.getDraggableShapeClickPoint()).toBeNull()
    expect(canvasEngine.getDraggableShape()).toBeNull()

    canvasEl.dispatchEvent(eventUp)
    canvasEngine.run()

    expect(canvasEngine.getDraggableShapeClickPoint()).toBeNull()
  })
})
