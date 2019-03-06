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
      let ctx = jasmine.createSpyObj('ctx', ['fillRect', 'fillStyle', 'strokeRect'])

      shape.draw(ctx)

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

  describe('Should detect border with', () => {
    using({
      'move up': new Shape(shape.getX(), shape.getY() - shape.getHeight(), shapeW, shapeH),
      'move down': new Shape(shape.getX(), shape.getOffsetY(), shapeW, shapeH),
      'move left': new Shape(shape.getX() - shape.getWidth(), shape.getY(), shapeW, shapeH),
      'move right': new Shape(shape.getX() + shape.getWidth(), shape.getY(), shapeW, shapeH),
      'transform and move up': new Shape(shape.getX(), shape.getY() - shape.getWidth(), shapeH, shapeW),
      'edge case': new Shape(
        shape.getX() + shape.getWidth(),
        shape.getY() - shape.getHeight(),
        shapeW,
        shapeH
      )
    }, (borderWithShape, description) => {
      it(`${borderWithShape} to the ${shape} (${description})`, () => {
        expect(borderWithShape.bordersWith(shape, snapToOffset)).toBeTruthy()
      })
    })
  })

  describe('Should NOT detect border with', () => {
    using({
      'itself': new Shape(shape.getX(), shape.getY(), shapeW, shapeH),
      'shift right': new Shape(shape.getX() + halfWidth, shape.getY(), shapeW, shapeH),
      'shift left': new Shape(shape.getX() - halfWidth, shape.getY(), shapeW, shapeH),
      'transform': new Shape(shape.getX(), shape.getY(), shapeH, shapeW),
      'transform and shift right': new Shape(shape.getX() + halfWidth, shape.getY(), shapeH, shapeW),
      'transform and shift up': new Shape(shape.getX(), shape.getY() - halfWidth, shapeH, shapeW),
      'transform and shift up right': new Shape(shape.getX() + halfWidth, shape.getY() - halfWidth, shapeH, shapeW),
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
    }, (noBorderWithShape, description) => {
      it(`${noBorderWithShape} to the ${shape} (${description})`, () => {
        expect(noBorderWithShape.bordersWith(shape, snapToOffset)).toBeFalsy()
      })
    })
  })

  describe('Should detect allowing snapping', () => {
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

  describe('Should NOT detect allowing allow snapping', () => {
    using({
      'itself': new Shape(shape.getX(), shape.getY(), shapeW, shapeH),
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

  describe('Should snap one shape to other', () => {
    using({
      'move up': new Shape(shape.getX(), shape.getY() - shape.getHeight() - snapToOffset, shapeW, shapeH)
    }, (shapeToBeSnapedTo, description) => {
      it(`${shapeToBeSnapedTo} to the ${shape} (${description})`, () => {
        shapeToBeSnapedTo.snapTo(shape)

        expect(shapeToBeSnapedTo.getX(shape)).toBe(shape.getX())
        expect(shapeToBeSnapedTo.getY(shape)).toBe(shape.getY() - shape.getHeight())
      })
    })
  })
})
