import React, { Component } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";

import "./style.css";

let passiveSupported = false;

try {
  let options = Object.defineProperty({}, "passive", {
    get: () => (passiveSupported = true)
  });

  window.addEventListener("test", null, options);
} catch (error) {}

const eventOptions = passiveSupported ? { passive: true } : false;

const debounce = (method, wait, immediate) => {
  let timeout;

  return () => {
    let context = this;
    let args = arguments;

    let later = function() {
      timeout = null;
      if (!immediate) {
        method.apply(context, args);
      }
    };

    let callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      method.apply(context, args);
    }
  };
};

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.resizeEvents = [];
    this._resizeHandler = debounce(() => this._updateDimensions());

    this.state = {
      width: 0,
      height: 0
    };
  }

  /** Perform action for resize event */
  _resize(width, height) {
    const { resizeEvents } = this;

    for (let i = 0; i < resizeEvents.length; i++) {
      resizeEvents[i](width, height);
    }
  }

  _updateDimensions() {
    const wrapper = this.wrapper;
    const { offsetWidth, offsetHeight } = wrapper;

    this._resize(offsetWidth, offsetHeight);

    this.setState({
      width: offsetWidth,
      height: offsetHeight
    });
  }

  _mount() {
    const { onResize } = this.props;
    const wrapper = this.wrapper;
    const { offsetWidth, offsetHeight } = wrapper;

    window.addEventListener("resize", this._resizeHandler, eventOptions);
    wrapper.addEventListener("resize", this._resizeHandler, eventOptions);

    this.setState({
      width: offsetWidth,
      height: offsetHeight
    });

    this.onResize(onResize);
  }

  _unmount() {
    const wrapper = this.wrapper;

    window.removeEventListener("resize", this._resizeHandler);
    wrapper.removeEventListener("resize", this._resizeHandler);

    this.clearResize();
  }

  /** Bind an event handler to the resize event. */
  onResize(resizeEvent) {
    if (typeof resizeEvent === "function") {
      this.resizeEvents.push(resizeEvent);
      return () => this.removeResize(resizeEvent);
    }
  }

  /** Unbind an event handler from the resize event. */
  removeResize(resizeEvent) {
    const index = this.resizeEvents.indexOf(resizeEvent);

    if (index !== -1) {
      this.resizeEvents.splice(index, 1);
    }
  }

  /** Unbind all event handlers from the resize event. */
  clearResize() {
    this.resizeEvents = [];
  }

  /** Retrieve the canvas react component. */
  getCanvasElement() {
    return this.canvas;
  }

  /** Get the width of the canvas react component. */
  getCanvasWidth() {
    return this.canvas.width;
  }

  /** Get the height of the canvas react component. */
  getCanvasHeight() {
    return this.canvas.height;
  }

  /** Get the context of the canvas. */
  getContext() {
    const canvas = this.canvas;

    return canvas.getContext("2d");
  }

  /** Get the image data of the canvas with a give area. */
  getImageData(
    startX = 0,
    startY = 0,
    endX = this.canvas.width,
    endY = this.canvas.height
  ) {
    return this.getContext().getImageData(startX, startY, endX, endY);
  }

  componentDidMount() {
    this._mount();
  }

  componentWillUnmount() {
    this._unmount();
  }

  render() {
    const { className, style, canvasClassName, canvasStyle } = this.props;
    const { width, height } = this.state;

    return (
      <div
        ref={wrapper => (this.wrapper = wrapper)}
        className={ClassNames("canvas-container", className)}
        style={style}
      >
        <canvas
          ref={canvas => (this.canvas = canvas)}
          className={canvasClassName}
          style={canvasStyle}
          width={width}
          height={height}
        />
      </div>
    );
  }
}

Canvas.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape(),
  canvasClassName: PropTypes.string,
  canvasStyle: PropTypes.shape(),
  onResize: PropTypes.func
};

Canvas.defaultProps = {
  className: "",
  style: {},
  canvasClassName: "",
  canvasStyle: {},
  onResize: () => {}
};

export default Canvas;
