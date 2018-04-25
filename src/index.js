import React, { Component } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";
import debounce from "debounce";
import supportsPassive from "supports-passive";

import "./style.css";

const eventOptions = supportsPassive ? { passive: true } : false;

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
    const { props, wrapper } = this;
    const { offsetWidth, offsetHeight } = wrapper;

    window.addEventListener("resize", this._resizeHandler, eventOptions);
    wrapper.addEventListener("resize", this._resizeHandler, eventOptions);

    this.setState({
      width: offsetWidth,
      height: offsetHeight
    });

    if (props.onResize) {
      this.onResize(props.onResize);
    }
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
  getContext(contextType = "2d") {
    this.canvas.getContext(contextType);
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
    const { id, className, style, canvasClassName, canvasStyle } = this.props;
    const { width, height } = this.state;

    return (
      <div
        ref={w => (this.wrapper = w)}
        id={id}
        className={ClassNames("canvas-container", className)}
        style={style}
      >
        <canvas
          ref={c => (this.canvas = c)}
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
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.shape(),
  canvasClassName: PropTypes.string,
  canvasStyle: PropTypes.shape(),
  onResize: PropTypes.func
};

export default Canvas;
