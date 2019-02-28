describe('hello', function(){

  let boxApp, canvasEl;

  // inject the HTML fixture for the tests
  beforeEach(function() {
    var fixture = `<canvas id="canvas" width="800" height="600"> 
    This text is displayed if your browser does not support HTML5 Canvas. 
    </canvas>`;

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);
  });

  // remove the html fixture from the DOM
  afterEach(function() {
    // document.body.removeChild(document.getElementById('canvas'));
  });

  // call the init function of calculator to register DOM elements
  beforeEach(function() {
    canvasEl = document.querySelector('canvas')
    boxApp = new BoxApp(canvasEl, {
      'snapToOffset': 20
    })
  });


  it('should say hello', function(){


    boxApp
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


    expect('hello world').toBe('hello world');
  })
})