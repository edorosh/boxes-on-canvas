import Shape from './shape'
import BoxApp from './boxApp'

const canvasId = 'canvas'

function initBoxApp () {
  const canvasEl = document.querySelector(`#${canvasId}`)
  const boxApp = new BoxApp(canvasEl)

  boxApp
    .add(new Shape(5, 4, 30, 10))
    .add(new Shape(5, 20, 20, 10))
    .add(new Shape(5, 40, 40, 10))
    .add(new Shape(5, 90, 30, 10))
    .draw()
}

document.addEventListener('DOMContentLoaded', initBoxApp)
