import Shape from '../src/shape'

describe('Function Shape(), represents a shape to be drawn on canvas', () => {
  let shape

  beforeEach(() => {
    shape = new Shape(10, 20, 100, 200)
  })

  it('should return x coordinate', () => {
    expect(shape.getX()).toBe(10)
  })

  it('should return y coordinate', () => {
    expect(shape.getY()).toBe(20)
  })

  it('should return width', () => {
    expect(shape.getWidth()).toBe(100)
  })

  it('should return height', () => {
    expect(shape.getHeight()).toBe(200)
  })

  it('should display by context', () => {
    let ctx = jasmine.createSpyObj('ctx', ['fillRect', 'fillStyle'])

    shape.display(ctx)

    expect(ctx.fillStyle).toBe(Shape.defaultFillColor)
    expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 100, 200)
  })

  it('should detect collisions with other shapes', () => {
    let shapeInCollision = new Shape(
      shape.getX() + shape.getWidth() - 10,
      shape.getY() + shape.getHeight() - 10,
      100,
      200
    )

    expect(shape.collidesWith(shapeInCollision)).toBeTruthy()
  })
})
