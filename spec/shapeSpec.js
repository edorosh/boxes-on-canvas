import Shape from '../src/shape'

describe('Class Shape(), represents a shape to be drawn on a Canvas', () => {
  const stickyOffset = 10
  let shape, collideShapeList, notCollideShapeList, stickToShapeList, notStickToShapeList

  beforeEach(() => {
    shape = new Shape(10, 20, 100, 200)
    collideShapeList = [
      new Shape(
        shape.getOffsetX() - 10,
        shape.getOffsetY(),
        100,
        200
      ),
      new Shape(
        shape.getOffsetX(),
        shape.getOffsetY() - 10,
        100,
        200
      ),
      new Shape(
        shape.getOffsetX() - 10,
        shape.getOffsetY() - 10,
        100,
        200
      )
    ]
    notCollideShapeList = [
      new Shape(
        shape.getOffsetX(),
        shape.getOffsetY(),
        100,
        200
      ),
      new Shape(
        shape.getOffsetX() + 1,
        shape.getOffsetY(),
        100,
        200
      ),
      new Shape(
        shape.getOffsetX(),
        shape.getOffsetY() + 1,
        100,
        200
      ),
      new Shape(
        shape.getOffsetX() + 1,
        shape.getOffsetY() + 1,
        100,
        200
      )
    ]
    stickToShapeList = [
      new Shape(
        shape.getOffsetX() + stickyOffset,
        shape.getOffsetY(),
        100,
        200
      ),
      new Shape(
        shape.getOffsetX(),
        shape.getOffsetY() + stickyOffset,
        100,
        200
      ),
      new Shape(
        shape.getOffsetX() + stickyOffset,
        shape.getOffsetY() + stickyOffset,
        100,
        200
      )
    ]
    notStickToShapeList = [
      new Shape(
        shape.getOffsetX() + stickyOffset + 1,
        shape.getOffsetY(),
        100,
        200
      ),
      new Shape(
        shape.getOffsetX(),
        shape.getOffsetY() + stickyOffset + 1,
        100,
        200
      ),
      new Shape(
        shape.getOffsetX() + stickyOffset + 1,
        shape.getOffsetY() + stickyOffset + 1,
        100,
        200
      )
    ]
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

  it('should return offset X', () => {
    expect(shape.getOffsetX()).toBe(10 + 100)
  })

  it('should return offset Y', () => {
    expect(shape.getOffsetY()).toBe(20 + 200)
  })

  it('should display by context', () => {
    let ctx = jasmine.createSpyObj('ctx', ['fillRect', 'fillStyle'])

    shape.display(ctx)

    expect(ctx.fillStyle).toBe(Shape.defaultFillColor)
    expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 100, 200)
  })

  it('should detect collisions with shapes', () => {
    for (let shapeInCollision of collideShapeList) {
      expect(shape.collidesWith(shapeInCollision)).toBeTruthy()
    }
  })

  it('should not detect collisions with shapes', () => {
    for (let shapeNotInCollision of notCollideShapeList) {
      expect(shape.collidesWith(shapeNotInCollision)).toBeFalsy()
    }
  })

  it('should allow sticking itself to the shape', () => {
    for (let shapeToBeSticked of stickToShapeList) {
      expect(shapeToBeSticked.isStickableTo(shape, stickyOffset)).toBeTruthy()
    }
  })

  it('should not allow sticking itself to the shape', () => {
    for (let shapeToBeSticked of stickToShapeList) {
      expect(shapeToBeSticked.isStickableTo(shape, stickyOffset)).toBeTruthy()
    }
  })
})
