import BoxApp from '../src/boxApp'
import Shape from '../src/shape'

describe('Class Box App represents drawing component', () => {
  let boxApp, canvasEl, ctxMock

  beforeEach(() => {
    canvasEl = jasmine.createSpyObj('canvasEl', ['getContext'])
    ctxMock = jasmine.createSpyObj('ctx', ['fillRect', 'fillStyle'])
    canvasEl.getContext.and.returnValue(ctxMock)

    boxApp = new BoxApp(canvasEl)
  })

  it('Should add Shapes to the canvas', () => {
    const shape = new Shape(5, 5, 4, 2)
    boxApp.add(shape)

    expect(boxApp.size).toEqual(1)
    expect(boxApp.has(shape)).toBeTruthy()
  })

  it('Should draw added Shapes on the canvas', () => {
    const shape = new Shape(5, 5, 4, 2)

    spyOn(shape, 'draw')

    boxApp.add(shape)
    boxApp.draw()

    expect(shape.draw).toHaveBeenCalledWith(ctxMock)
  })
})
