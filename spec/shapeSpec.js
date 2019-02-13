import using from 'jasmine-data-provider'
import Shape from '../src/shape'

describe('Class Shape', () => {
  const shapeX = 5
  const shapeY = 4
  const shapeW = 2
  const shapeH = 1
  const halfWidth = parseInt(shapeW / 2, 10)

  const snapToOffset = 1

  const shape = new Shape(shapeX, shapeY, shapeW, shapeH)

  describe('Should return coordinates', () => {
    it('should return x coordinate', () => {
      expect(shape.getX()).toBe(shapeX)
    })

    it('should return y coordinate', () => {
      expect(shape.getY()).toBe(shapeY)
    })

    it('should return width', () => {
      expect(shape.getWidth()).toBe(shapeW)
    })

    it('should return height', () => {
      expect(shape.getHeight()).toBe(shapeH)
    })

    it('should return offset X', () => {
      expect(shape.getOffsetX()).toBe(shapeX + shapeW)
    })

    it('should return offset Y', () => {
      expect(shape.getOffsetY()).toBe(shapeY + shapeH)
    })
  })

  describe('Should be drawable', () => {
    it('by Canvas', () => {
      let ctx = jasmine.createSpyObj('ctx', ['fillRect', 'fillStyle'])

      shape.display(ctx)

      expect(ctx.fillStyle).toBe(Shape.defaultFillColor)
      expect(ctx.fillRect).toHaveBeenCalledWith(shapeX, shapeY, shapeW, shapeH)
    })
  })

  describe('Should detect collisions', () => {
    using({
      'itself': new Shape(shape.getX(), shape.getY(), shapeW, shapeH),
      'shift right': new Shape(shape.getX() + halfWidth, shape.getY(), shapeW, shapeH),
      'shift left': new Shape(shape.getX() - halfWidth, shape.getY(), shapeW, shapeH),
      'transform': new Shape(shape.getX(), shape.getY(), shapeH, shapeW),
      'transform and shift right': new Shape(shape.getX() + halfWidth, shape.getY(), shapeH, shapeW),
      'transform and shift up': new Shape(shape.getX(), shape.getY() - halfWidth, shapeH, shapeW),
      'transform and shift up right': new Shape(shape.getX() + halfWidth, shape.getY() - halfWidth, shapeH, shapeW)
    }, (overlapShape, description) => {
      it(`${overlapShape} with the ${shape} (${description})`, () => {
        expect(shape.collidesWith(overlapShape)).toBeTruthy()
      })
    })
  })

  describe('Should NOT detect collisions', () => {
    using({
      'move up': new Shape(shape.getX(), shape.getY() - halfWidth, shapeW, shapeH),
      'move down': new Shape(shape.getX(), shape.getY() + halfWidth, shapeW, shapeH),
      'move left': new Shape(shape.getX() - shape.getWidth(), shape.getY(), shapeW, shapeH),
      'move right': new Shape(shape.getX() + shape.getWidth(), shape.getY(), shapeW, shapeH),
      'transform and move left': new Shape(shape.getX() - halfWidth, shape.getY() - halfWidth, shapeH, shapeW),
      'transform and move right': new Shape(shape.getX() + shape.getWidth(), shape.getY() - halfWidth, shapeH, shapeW)
    }, (borderShape, description) => {
      it(`${borderShape} with the ${shape} (${description})`, () => {
        expect(shape.collidesWith(borderShape)).toBeFalsy()
      })
    })
  })

  describe('Should allow snapping', () => {
    using({
      'move up': new Shape(shape.getX(), shape.getY() - shape.getHeight() - snapToOffset, shapeW, shapeH),
      'move down': new Shape(shape.getX(), shape.getOffsetY() + snapToOffset, shapeW, shapeH),
      'move left': new Shape(shape.getX() - shape.getWidth() - snapToOffset, shape.getY(), shapeW, shapeH),
      'move right': new Shape(shape.getX() + shape.getWidth() + snapToOffset, shape.getY(), shapeW, shapeH),
      'transform and move up': new Shape(shape.getX(), shape.getY() - shape.getWidth() - snapToOffset, shapeH, shapeW),
      'edge case': new Shape(
        shape.getX() + shape.getWidth() + snapToOffset,
        shape.getY() - shape.getHeight() - snapToOffset,
        shapeW,
        shapeH
      )
    }, (snapToShape, description) => {
      it(`${snapToShape} to the ${shape} (${description})`, () => {
        expect(snapToShape.isStickableTo(shape, snapToOffset)).toBeTruthy()
      })
    })
  })

  describe('Should NOT allow snapping', () => {
    using({
      'move up': new Shape(shape.getX(), shape.getY() - shape.getHeight() - snapToOffset - 1, shapeW, shapeH),
      'move down': new Shape(shape.getX(), shape.getOffsetY() + snapToOffset + 1, shapeW, shapeH),
      'move left': new Shape(shape.getX() - shape.getWidth() - snapToOffset - 1, shape.getY(), shapeW, shapeH),
      'move right': new Shape(shape.getOffsetX() + snapToOffset + 1, shape.getY(), shapeW, shapeH)
    }, (notSnapToShape, description) => {
      it(`${notSnapToShape} to the ${shape} (${description})`, () => {
        expect(notSnapToShape.isStickableTo(shape, snapToOffset)).toBeFalsy()
      })
    })
  })
})
