describe('Shape Interactions', function () {
  let boxApp; let canvasEl; let canvasCounter = 1; let snapToOffset = 20; let canvasRect

  beforeAll(function () {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<p>Canvas samples</p>')

    // @todo add css fixtures
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
    boxApp = new BoxApp(canvasEl, {
      'snapToOffset': snapToOffset
    })
    canvasRect = canvasEl.getBoundingClientRect()
  })

  afterEach(function () {
    // document.body.removeChild(document.getElementById(`${this.canvasSelector}`));
    canvasCounter++
  })

  it('should calculate view port mode', function () {
    const { width, height } = BoxApp.getViewportDimensionsForElement(canvasEl)

    const offsetTop = canvasEl.offsetTop * 2
    const offsetWidth = canvasEl.offsetLeft * 2

    expect(width).toBe(window.innerWidth - offsetWidth)
    expect(height).toBe(window.innerHeight - offsetTop)
  })

  it('should enter view port mode', function () {
    const width = 120
    const height = 100

    spyOn(BoxApp, 'getViewportDimensionsForElement').and.returnValue({ width, height })

    boxApp
      .enterFullViewportMode()
      .run()

    expect(canvasEl.width).toBe(width)
    expect(canvasEl.height).toBe(height)
  })

  it('should be in collision', function () {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(69, 30, 80, 80)

    boxApp
      .add(shape1)
      .add(shape2)
      .run()

    expect(shape1.fill).toBe(BoxApp.collideColor)
    expect(shape2.fill).toBe(BoxApp.collideColor)
  })

  it('should not be in collision if borders', () => {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, 90, 80, 80)

    boxApp
      .add(shape1)
      .add(shape2)
      .run()

    expect(shape1.fill).toBe(Shape.defaultFillColor)
    expect(shape2.fill).toBe(Shape.defaultFillColor)

    expect(shape2.bordersWith(shape1)).toBeTruthy()
  })

  it('should not snap to', function () {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, shape1.getOffsetY() + snapToOffset + 1, 80, 80)

    boxApp
      .add(shape1)
      .add(shape2)
      .run()

    expect(shape1.bordersWith(shape2)).toBeFalsy()
  })

  // @todo define this test for canvas Engine
  xit('should select the Shape on mouse down', () => {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, shape1.getOffsetY() + snapToOffset + 1, 80, 80)

    boxApp
      .add(shape1)
      .add(shape2)
      .run()

    const eventDown = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 52 + canvasRect.left,
      clientY: 52 + canvasRect.top
    })

    const eventUp = new MouseEvent('mouseup', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 52 + canvasRect.left,
      clientY: 52 + canvasRect.top
    })

    canvasEl.dispatchEvent(eventDown)

    boxApp.run()

    expect(boxApp.selectedForDragAndDropShape).toBe(shape1)

    canvasEl.dispatchEvent(eventUp)

    boxApp.run()

    expect(boxApp.selectedForDragAndDropShape).toBeNull()
  })

  // @todo define this test for canvas Engine
  xit('should not select any Shape on mouse down', () => {
    const shape1 = new Shape(10, 10, 80, 80)

    boxApp
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

    boxApp.run()

    expect(boxApp.selectedForDragAndDropShape).toBeNull()

    canvasEl.dispatchEvent(eventUp)

    boxApp.run()
  })

  it('should process collisions on object move', () => {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, shape1.getOffsetY() + snapToOffset + 1, 80, 80)

    boxApp
      .add(shape1)
      .add(shape2)
      .run()

    const eventDown = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 52 + canvasRect.left,
      clientY: 52 + canvasRect.top
    })

    const eventMove = new MouseEvent('mousemove', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 52 + canvasRect.left,
      clientY: 52 + canvasRect.top + shape1.getHeight()
    })

    canvasEl.dispatchEvent(eventDown)
    boxApp.run()
    canvasEl.dispatchEvent(eventMove)
    boxApp.run()

    boxApp.run()

    expect(shape1.fill).toBe(BoxApp.collideColor)
    expect(shape2.fill).toBe(BoxApp.collideColor)
  })

  it('should process collisions on object move and get back to initial position', () => {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, shape1.getOffsetY() + snapToOffset + 1, 80, 80)

    const initialPoint1 = {
      x: shape1.x,
      y: shape1.y
    }

    const initialPoint2 = {
      x: shape2.x,
      y: shape2.y
    }

    boxApp
      .add(shape1)
      .add(shape2)
      .run()

    const eventDown = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 52 + canvasRect.left,
      clientY: 52 + canvasRect.top
    })
    const eventMove = new MouseEvent('mousemove', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 52 + canvasRect.left,
      clientY: 52 + canvasRect.top + shape1.getHeight()
    })
    const eventUp = new MouseEvent('mouseup', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 52 + canvasRect.left,
      clientY: 52 + canvasRect.top + shape1.getHeight()
    })

    canvasEl.dispatchEvent(eventDown)
    boxApp.run()
    canvasEl.dispatchEvent(eventMove)
    boxApp.run()
    canvasEl.dispatchEvent(eventUp)
    boxApp.run()

    expect(shape1.fill).toBe(Shape.defaultFillColor)
    expect(shape2.fill).toBe(Shape.defaultFillColor)

    expect(shape1.x).toBe(initialPoint1.x)
    expect(shape1.y).toBe(initialPoint1.y)

    // Bug with wrong snapping on animation
    expect(shape2.x).toBe(initialPoint2.x)
    expect(shape2.y).toBe(initialPoint2.y)
  })

  it('should snap draggable Shape to other Shape', function () {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, shape1.getOffsetY() + snapToOffset + 5, 80, 80)

    boxApp
      .add(shape1)
      .add(shape2)
      .run()

    const eventDown = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 15 + canvasRect.left,
      clientY: shape2.y + 1 + canvasRect.top
    })
    const eventMove = new MouseEvent('mousemove', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 15 + canvasRect.left,
      clientY: shape2.y - 5 + canvasRect.top
    })

    canvasEl.dispatchEvent(eventDown)
    boxApp.run()
    canvasEl.dispatchEvent(eventMove)
    boxApp.run()

    expect(shape1.bordersWith(shape2)).toBeTruthy()
    expect(shape1.collidesWith(shape2)).toBeFalsy()
  })

  it('should snap draggable Shape to other Shape with no collisions', function () {
    const shape1 = new Shape(10, 20, 80, 80)
    const shape2 = new Shape(shape1.getOffsetX(), shape1.y - snapToOffset / 2, 80, 80)
    const shape3 = new Shape(10, shape1.getOffsetY() + snapToOffset / 2, 80, 80)

    boxApp
      .add(shape1)
      .add(shape2)
      .add(shape3)
      .run()

    const eventDown = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 11 + canvasRect.left,
      clientY: shape3.y + 1 + canvasRect.top
    })
    const eventMove = new MouseEvent('mousemove', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      clientX: 12 + canvasRect.left,
      clientY: shape3.y - 1 + canvasRect.top
    })

    canvasEl.dispatchEvent(eventDown)
    boxApp.run()
    canvasEl.dispatchEvent(eventMove)
    boxApp.run()

    expect(shape1.collidesWith(shape3)).toBeFalsy()
    expect(shape1.bordersWith(shape3)).toBeTruthy()
  })
})
