# canvas

A canvas react UI component.
It hooks into resize on browser and itself to prevent the canvas from stretching.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/@jworkshop/canvas.svg
[npm-url]: http://npmjs.org/package/@jworkshop/canvas
[travis-image]: https://img.shields.io/travis/JWorkshop/canvas.svg
[travis-url]: https://travis-ci.org/JWorkshop/canvas
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/@jworkshop/canvas.svg
[download-url]: https://npmjs.org/package/@jworkshop/canvas

## install

[![NPM](https://nodei.co/npm/@jworkshop/canvas.png)](https://nodei.co/npm/@jworkshop/canvas)

## Usage

```javascript
import React, { Component } from "react";
import ReactDOM from "react-dom";

import Canvas from "@jworkshop/canvas";

import "./style.css";

class Example extends Component {
  render() {

    return (
      <Canvas
        className="className"
        style={}
        canvasClassName="canvasClassName"
        canvasStyle={}
        onResize={(width, height) => { ... }}
      />
    );
  }
}

ReactDOM.render(<Test />, document.getElementById("root"));
```
