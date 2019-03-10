import Point from '../src/point'

describe('Class Point', () => {
  it('is instantiated', () => {
    const point = new Point(5, 6)

    expect(point.x).toBe(5)
    expect(point.y).toBe(6)
  })

  it('is immutable', () => {
    const point = new Point(5, 6)

    expect(() => { point.x = 10 }).toThrowError(TypeError)
  })

  it('is comparable', () => {
    const point1 = new Point(5, 6)
    const point2 = new Point(8, 9)

    expect(point1.equals(point1)).toBeTruthy()
    expect(point1.equals(point2)).toBeFalsy()
  })
})
