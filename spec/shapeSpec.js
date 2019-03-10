import using from 'jasmine-data-provider'
import Shape from '../src/shape'
import Point from '../src/point'

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
      expect(shape.x).toBe(shapeX)
    })

    it('should return y coordinate', () => {
      expect(shape.y).toBe(shapeY)
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
      let ctx = jasmine.createSpyObj('ctx', [
        'fillRect',
        'fillStyle',
        'strokeRect',
        'save',
        'restore'
      ])

      shape.draw(ctx)

      expect(ctx.fillStyle).toBe(Shape.defaultFillColor)
      expect(ctx.fillRect).toHaveBeenCalledWith(shapeX, shapeY, shapeW, shapeH)
    })
  })

  describe('Should detect collisions', () => {
    using({
      'itself': new Shape(shape.x, shape.y, shapeW, shapeH),
      'shift right': new Shape(shape.x + halfWidth, shape.y, shapeW, shapeH),
      'shift left': new Shape(shape.x - halfWidth, shape.y, shapeW, shapeH),
      'transform': new Shape(shape.x, shape.y, shapeH, shapeW),
      'transform and shift right': new Shape(shape.x + halfWidth, shape.y, shapeH, shapeW),
      'transform and shift up': new Shape(shape.x, shape.y - halfWidth, shapeH, shapeW),
      'transform and shift up right': new Shape(shape.x + halfWidth, shape.y - halfWidth, shapeH, shapeW)
    }, (overlapShape, description) => {
      it(`${overlapShape} with the ${shape} (${description})`, () => {
        expect(shape.collidesWith(overlapShape)).toBeTruthy()
      })
    })
  })

  describe('Should NOT detect collisions', () => {
    using({
      'move up': new Shape(shape.x, shape.y - halfWidth, shapeW, shapeH),
      'move down': new Shape(shape.x, shape.y + halfWidth, shapeW, shapeH),
      'move left': new Shape(shape.x - shape.getWidth(), shape.y, shapeW, shapeH),
      'move right': new Shape(shape.x + shape.getWidth(), shape.y, shapeW, shapeH),
      'transform and move left': new Shape(shape.x - halfWidth, shape.y - halfWidth, shapeH, shapeW),
      'transform and move right': new Shape(shape.x + shape.getWidth(), shape.y - halfWidth, shapeH, shapeW)
    }, (borderShape, description) => {
      it(`${borderShape} with the ${shape} (${description})`, () => {
        expect(shape.collidesWith(borderShape)).toBeFalsy()
      })
    })
  })

  describe('Should detect border with', () => {
    using({
      'move up': new Shape(shape.x, shape.y - shape.getHeight(), shapeW, shapeH),
      'move down': new Shape(shape.x, shape.getOffsetY(), shapeW, shapeH),
      'move left': new Shape(shape.x - shape.getWidth(), shape.y, shapeW, shapeH),
      'move right': new Shape(shape.x + shape.getWidth(), shape.y, shapeW, shapeH),
      'transform and move up': new Shape(shape.x, shape.y - shape.getWidth(), shapeH, shapeW),
      'edge case': new Shape(
        shape.x + shape.getWidth(),
        shape.y - shape.getHeight(),
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
      'itself': new Shape(shape.x, shape.y, shapeW, shapeH),
      'shift right': new Shape(shape.x + halfWidth, shape.y, shapeW, shapeH),
      'shift left': new Shape(shape.x - halfWidth, shape.y, shapeW, shapeH),
      'transform': new Shape(shape.x, shape.y, shapeH, shapeW),
      'transform and shift right': new Shape(shape.x + halfWidth, shape.y, shapeH, shapeW),
      'transform and shift up': new Shape(shape.x, shape.y - halfWidth, shapeH, shapeW),
      'transform and shift up right': new Shape(shape.x + halfWidth, shape.y - halfWidth, shapeH, shapeW),
      'move up': new Shape(shape.x, shape.y - shape.getHeight() - snapToOffset, shapeW, shapeH),
      'move down': new Shape(shape.x, shape.getOffsetY() + snapToOffset, shapeW, shapeH),
      'move left': new Shape(shape.x - shape.getWidth() - snapToOffset, shape.y, shapeW, shapeH),
      'move right': new Shape(shape.x + shape.getWidth() + snapToOffset, shape.y, shapeW, shapeH),
      'transform and move up': new Shape(shape.x, shape.y - shape.getWidth() - snapToOffset, shapeH, shapeW),
      'edge case': new Shape(
        shape.x + shape.getWidth() + snapToOffset,
        shape.y - shape.getHeight() - snapToOffset,
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
      'move up': new Shape(shape.x, shape.y - shape.getHeight() - snapToOffset, shapeW, shapeH),
      'move down': new Shape(shape.x, shape.getOffsetY() + snapToOffset, shapeW, shapeH),
      'move left': new Shape(shape.x - shape.getWidth() - snapToOffset, shape.y, shapeW, shapeH),
      'move right': new Shape(shape.x + shape.getWidth() + snapToOffset, shape.y, shapeW, shapeH),
      'transform and move up': new Shape(shape.x, shape.y - shape.getWidth() - snapToOffset, shapeH, shapeW),
      'edge case': new Shape(
        shape.x + shape.getWidth() + snapToOffset,
        shape.y - shape.getHeight() - snapToOffset,
        shapeW,
        shapeH
      )
    }, (snapToShape, description) => {
      it(`${snapToShape} to the ${shape} (${description})`, () => {
        expect(snapToShape.isStickableTo(shape, snapToOffset)).toBeTruthy()
      })
    })
  })

  describe('Should NOT detect allow snapping', () => {
    using({
      'itself': new Shape(shape.x, shape.y, shapeW, shapeH),
      'move up': new Shape(shape.x, shape.y - shape.getHeight() - snapToOffset - 1, shapeW, shapeH),
      'move down': new Shape(shape.x, shape.getOffsetY() + snapToOffset + 1, shapeW, shapeH),
      'move left': new Shape(shape.x - shape.getWidth() - snapToOffset - 1, shape.y, shapeW, shapeH),
      'move right': new Shape(shape.getOffsetX() + snapToOffset + 1, shape.y, shapeW, shapeH)
    }, (notSnapToShape, description) => {
      it(`${notSnapToShape} to the ${shape} (${description})`, () => {
        expect(notSnapToShape.isStickableTo(shape, snapToOffset)).toBeFalsy()
      })
    })
  })

  it('isStickableTo should catch undefined offset', () => {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, 50, 80, 80)

    expect(() => { shape1.isStickableTo(shape2) }).toThrowError(Error)
  })

  it('should not snap shapes in collision', () => {
    const shape1 = new Shape(10, 10, 80, 80)
    const shape2 = new Shape(10, 50, 80, 80)

    expect(() => { shape1.snapTo(shape2) }).toThrowError(Error)
  })

  describe('Should snap one shape to other', () => {
    using({
      'move up': {
        shape: new Shape(shape.x, shape.y - shape.getHeight() - snapToOffset, shapeW, shapeH),
        x: shape.x,
        y: shape.y - shape.getHeight()
      },
      'move down': {
        shape: new Shape(shape.x, shape.getOffsetY() + snapToOffset, shapeW, shapeH),
        x: shape.x,
        y: shape.getOffsetY()
      },
      'move left': {
        shape: new Shape(shape.x - shape.getWidth() - snapToOffset, shape.y, shapeW, shapeH),
        x: shape.x - shape.getWidth(),
        y: shape.y
      },
      'move right': {
        shape: new Shape(shape.x + shape.getWidth() + snapToOffset, shape.y, shapeW, shapeH),
        x: shape.x + shape.getWidth(),
        y: shape.y
      }
    }, (config, description) => {
      const shapeToBeSnappedTo = config.shape

      it(`${shapeToBeSnappedTo} to the ${shape} (${description})`, () => {
        shapeToBeSnappedTo.snapTo(shape)

        expect(shapeToBeSnappedTo.x).toBe(config.x)
        expect(shapeToBeSnappedTo.y).toBe(config.y)
      })
    })
  })

  it('contains point', () => {
    const shape = new Shape(10, 10, 80, 80)
    const pointOnEdge = new Point(10, 10)
    const pointIn = new Point(15, 15)
    const pointOut = new Point(100, 100)

    expect(shape.hasPoint(pointOnEdge)).toBeTruthy()
    expect(shape.hasPoint(pointIn)).toBeTruthy()
    expect(shape.hasPoint(pointOut)).toBeFalsy()
  })
})
