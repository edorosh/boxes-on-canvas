import BoxApp from '../src/boxApp'
import Shape from '../src/shape'

describe('Class Box App represents drawing component', () => {
  let boxApp, canvasEl, ctxMock

  beforeEach(() => {
    canvasEl = jasmine.createSpyObj('canvasEl', ['getContext'])
    ctxMock = jasmine.createSpyObj('ctx', ['fillRect', 'fillStyle', 'strokeRect', 'clearRect'])
    canvasEl.getContext.and.returnValue(ctxMock)

    boxApp = new BoxApp(canvasEl)
  })

  // it('Should add Shapes to the canvas', () => {
  //   const shape = new Shape(5, 5, 4, 2)
  //   boxApp.add(shape)
  //
  //   expect(boxApp.size).toEqual(1)
  //   expect(boxApp.has(shape)).toBeTruthy()
  // })

  // it('Should draw added Shapes on the canvas', () => {
  //   const shape = new Shape(5, 5, 4, 2)
  //
  //   spyOn(shape, 'draw')
  //
  //   boxApp.add(shape)
  //   boxApp.draw()
  //
  //   expect(shape.draw).toHaveBeenCalledWith(ctxMock)
  // })

  it('Should fire event on object move', () => {
    const shape = new Shape(5, 5, 4, 2)
    const shapeMoving = new Shape(10, 5, 4, 2)
    const movingHandler = jasmine.createSpy('movingHandler')

    boxApp
      .add(shape)
      .add(shapeMoving)

    const event = new MouseEvent('mousedown', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    })

    canvasEl.dispatchEvent(event)

    boxApp.on('shape:moving', movingHandler)

    // mouse down and drag 1 px left and mouse up
    expect(movingHandler.calls.count()).toEqual(1)
    expect(movingHandler).toHaveBeenCalledWith(
      jasmine.objectContaining({
        current: shapeMoving
      })
    )
  })
})
