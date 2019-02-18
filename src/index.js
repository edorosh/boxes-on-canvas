import Shape from './shape'
import BoxApp from './boxApp'

const canvasId = 'canvas'

function initBoxApp () {
  const canvasEl = document.querySelector(`#${canvasId}`)
  const boxApp = new BoxApp(canvasEl)

  boxApp
    .add(new Shape(10, 10, 80, 80))
    .add(new Shape(69, 30, 80, 80))
    .add(new Shape(190, 10, 80, 80))
    .add(new Shape(280, 10, 80, 80))
    .add(new Shape(370, 10, 80, 80))
    .add(new Shape(460, 10, 80, 80))
    .update()
    .draw()
}

document.addEventListener('DOMContentLoaded', initBoxApp)
