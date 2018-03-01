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
    this.resizeHandler = debounce(() => this.updateDimensions());

    this.state = {
      width: 0,
      height: 0
    };
  }

  /** Add listener to the resize event. */
  onResize(resizeEvent) {
    if (typeof resizeEvent === "function") {
      this.resizeEvents.push(resizeEvent);
      return () => this.removeResize(resizeEvent);
    }
  }

  /** Remove listener to the resize event. */
  removeResize(resizeEvent) {
    const index = this.resizeEvents.indexOf(resizeEvent);

    if (index !== -1) {
      this.resizeEvents.splice(index, 1);
    }
  }

  /** Perform action for resize event */
  fireResizeEvent(width, height) {
    const { resizeEvents } = this;

    for (let i = 0; i < resizeEvents.length; i++) {
      resizeEvents[i](width, height);
    }
  }

  updateDimensions() {
    const wrapper = this.wrapper;
    const { offsetWidth, offsetHeight } = wrapper;

    this.fireResizeEvent(offsetWidth, offsetHeight);

    this.setState({
      width: offsetWidth,
      height: offsetHeight
    });
  }

  getCanvasElement() {
    return this.canvas;
  }

  getCanvasWidth() {
    return this.canvas.width;
  }

  getCanvasHeight() {
    return this.canvas.height;
  }

  getContext() {
    const canvas = this.canvas;

    return canvas.getContext("2d");
  }

  getImageData(startX, startY, endX, endY) {
    return this.getContext().getImageData(startX, startY, endX, endY);
  }

  mount() {
    const { onResize } = this.props;
    const wrapper = this.wrapper;
    const { offsetWidth, offsetHeight } = wrapper;

    window.addEventListener("resize", this.resizeHandler, eventOptions);
    wrapper.addEventListener("resize", this.resizeHandler, eventOptions);

    this.setState({
      width: offsetWidth,
      height: offsetHeight
    });

    this.onResize(onResize);
  }

  unmount() {
    const { resizeEvents } = this;
    const wrapper = this.wrapper;

    window.removeEventListener("resize", this.resizeHandler);
    wrapper.removeEventListener("resize", this.resizeHandler);

    for (var i = 0; i < resizeEvents.length; i++) {
      this.removeResize(resizeEvents[i]);
    }
  }

  componentDidMount() {
    this.mount();
  }

  componentWillUnmount() {
    this.unmount();
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
