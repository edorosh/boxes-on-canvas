[![Build Status](https://travis-ci.org/edorosh/boxes-on-canvas.svg?branch=master)](https://travis-ci.org/edorosh/boxes-on-canvas)
[![Coverage Status](https://coveralls.io/repos/github/edorosh/boxes-on-canvas/badge.svg?branch=master)](https://coveralls.io/github/edorosh/boxes-on-canvas?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/edorosh/boxes-on-canvas)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8fc79eef5c7f4d05a76af6d75ec6e5ef)](https://app.codacy.com/app/edorosh/boxes-on-canvas?utm_source=github.com&utm_medium=referral&utm_content=edorosh/boxes-on-canvas&utm_campaign=Badge_Grade_Dashboard)

# Boxes on Canvas (2D)
The App draws boxes (rectangles) on a web page and allows an User to drag & drop them. The app was developed 
within my JS practices (Modules, Bundler, TDD, CI).

## Requirements
Canvas is used to render shapes. The draw area has size of the page viewport with some padding. Several 
rectangles of different sizes are displayed on the page load one under the other. An end User can drag & 
drop shapes via a mouse.  

If a shape intersects with other shapes during the mouse move event then all intersecting shapes should 
change the color in red. Mouse up event is allowed only if none of shapes intersect with draggable one. 
Otherwise the draggable shapes gets back to the initial position.  

A shape can be snapped to the nearest one on moving action. Snapping occurs when any side of a shape being 
moved approaches a side of other shape closer then a distance <= X. Shapes get positioned close 
to each other in relation of bordering edges. In order to split shapes a User should drag a shape on a 
distance > X. Snapping should work in a way to avoid shapes intersections.

There should be a canvas with rectangles of different sizes one under the other on the page load. 

The app should not use any 3d party libs.

## Installation
1. Checkout git repository
1. Run `npm install` to install dependencies
1. Run `npm run test` to test the App
1. Run `npm run build` to build the App
1. Run `npm run karma` to run visual tests
1. Open `dist/index.html` in a Browser (preferably in Chrome)

## User Guide

Drag and drop rectangles.

## Contributing

Source code is located in `src` folder. Tests are in `spec` and `visualSpec` folders (see the TDD section). 

The codebase uses ESModule definition. During the development it is productive to see the results of you 
feature. To enable live rebuild start Webpack Dev server by command `npm run start`.  

Run `npm run dev` to build the app with source maps enabled.

### TDD
Jasmine is used as a testing framework. Karma is used to run browser specific tests.

In case you're adding a business logic with no dependency on a window object then you add test with 
no web browser required. These tests are in `spec` folder. The command to run tests is
 `npm run test`  

If your feature requires a Web Browser then you'll have to add tests to `visualSpec` folder. The command to run 
tests is `npm run karma`. Open `visualSpec/index.html` to run visual tests.  

Once a feature is done make sure the code passes ES Lint. Run `npm run cs-fix-src` or `npm run cs-fix-spec`

## Todo List
* add Karma to Travis CI
* enable animation in boxApp
* increase test coverage
* refactor the App in more Event Driven Approach
* split webpack prod/test config
* rethink Babel usage
* refactor console.log calls
