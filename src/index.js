import Shape from './shape'
import BoxApp from './boxApp'
import style from './css/main.css'

const canvasId = 'canvas'

function initBoxApp () {
  const canvasEl = document.querySelector(`#${canvasId}`)
  const boxApp = new BoxApp(canvasEl, {
    'snapToOffset': 20
  })

  boxApp
    .setUpEvents()
    .enterFullViewportMode()

    // Collide
    .add(new Shape(10, 10, 80, 80))
    .add(new Shape(69, 30, 80, 80))

    // Border
    .add(new Shape(221.222, 10, 80, 80))
    .add(new Shape(221.222, 90, 80, 80))

    // Snap to
    .add(new Shape(351, 200, 80, 80))
    .add(new Shape(351, 110, 80, 80))
    .add(new Shape(351, 290, 80, 80))
    .add(new Shape(441, 200, 80, 80))
    .add(new Shape(261, 200, 80, 80))
    .add(new Shape(441, 110, 80, 80))

    // Not Snap to
    .add(new Shape(480, 10, 80, 80))
    .add(new Shape(600, 10, 80, 80))
}

document.addEventListener('DOMContentLoaded', initBoxApp)
