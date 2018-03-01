"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arguments = arguments;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var passiveSupported = false;

try {
  var options = Object.defineProperty({}, "passive", {
    get: function get() {
      return passiveSupported = true;
    }
  });

  window.addEventListener("test", null, options);
} catch (error) {}

var eventOptions = passiveSupported ? { passive: true } : false;

var debounce = function debounce(method, wait, immediate) {
  var timeout = void 0;

  return function () {
    var context = undefined;
    var args = _arguments;

    var later = function later() {
      timeout = null;
      if (!immediate) {
        method.apply(context, args);
      }
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      method.apply(context, args);
    }
  };
};

var Canvas = function (_Component) {
  _inherits(Canvas, _Component);

  function Canvas(props) {
    _classCallCheck(this, Canvas);

    var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, props));

    _this.resizeEvents = [];
    _this._resizeHandler = debounce(function () {
      return _this._updateDimensions();
    });

    _this.state = {
      width: 0,
      height: 0
    };
    return _this;
  }

  /** Perform action for resize event */


  _createClass(Canvas, [{
    key: "_resize",
    value: function _resize(width, height) {
      var resizeEvents = this.resizeEvents;


      for (var i = 0; i < resizeEvents.length; i++) {
        resizeEvents[i](width, height);
      }
    }
  }, {
    key: "_updateDimensions",
    value: function _updateDimensions() {
      var wrapper = this.wrapper;
      var offsetWidth = wrapper.offsetWidth,
          offsetHeight = wrapper.offsetHeight;


      this._resize(offsetWidth, offsetHeight);

      this.setState({
        width: offsetWidth,
        height: offsetHeight
      });
    }
  }, {
    key: "_mount",
    value: function _mount() {
      var onResize = this.props.onResize;

      var wrapper = this.wrapper;
      var offsetWidth = wrapper.offsetWidth,
          offsetHeight = wrapper.offsetHeight;


      window.addEventListener("resize", this._resizeHandler, eventOptions);
      wrapper.addEventListener("resize", this._resizeHandler, eventOptions);

      this.setState({
        width: offsetWidth,
        height: offsetHeight
      });

      this.onResize(onResize);
    }
  }, {
    key: "_unmount",
    value: function _unmount() {
      var wrapper = this.wrapper;

      window.removeEventListener("resize", this._resizeHandler);
      wrapper.removeEventListener("resize", this._resizeHandler);

      this.clearResize();
    }

    /** Bind an event handler to the resize event. */

  }, {
    key: "onResize",
    value: function onResize(resizeEvent) {
      var _this2 = this;

      if (typeof resizeEvent === "function") {
        this.resizeEvents.push(resizeEvent);
        return function () {
          return _this2.removeResize(resizeEvent);
        };
      }
    }

    /** Unbind an event handler from the resize event. */

  }, {
    key: "removeResize",
    value: function removeResize(resizeEvent) {
      var index = this.resizeEvents.indexOf(resizeEvent);

      if (index !== -1) {
        this.resizeEvents.splice(index, 1);
      }
    }

    /** Unbind all event handlers from the resize event. */

  }, {
    key: "clearResize",
    value: function clearResize() {
      this.resizeEvents = [];
    }

    /** Retrieve the canvas react component. */

  }, {
    key: "getCanvasElement",
    value: function getCanvasElement() {
      return this.canvas;
    }

    /** Get the width of the canvas react component. */

  }, {
    key: "getCanvasWidth",
    value: function getCanvasWidth() {
      return this.canvas.width;
    }

    /** Get the height of the canvas react component. */

  }, {
    key: "getCanvasHeight",
    value: function getCanvasHeight() {
      return this.canvas.height;
    }

    /** Get the context of the canvas. */

  }, {
    key: "getContext",
    value: function getContext() {
      var canvas = this.canvas;

      return canvas.getContext("2d");
    }

    /** Get the image data of the canvas with a give area. */

  }, {
    key: "getImageData",
    value: function getImageData() {
      var startX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var startY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var endX = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.canvas.width;
      var endY = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.canvas.height;

      return this.getContext().getImageData(startX, startY, endX, endY);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this._mount();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._unmount();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          className = _props.className,
          style = _props.style,
          canvasClassName = _props.canvasClassName,
          canvasStyle = _props.canvasStyle;
      var _state = this.state,
          width = _state.width,
          height = _state.height;


      return _react2.default.createElement(
        "div",
        {
          ref: function ref(wrapper) {
            return _this3.wrapper = wrapper;
          },
          className: (0, _classnames2.default)("canvas-container", className),
          style: style
        },
        _react2.default.createElement("canvas", {
          ref: function ref(canvas) {
            return _this3.canvas = canvas;
          },
          className: canvasClassName,
          style: canvasStyle,
          width: width,
          height: height
        })
      );
    }
  }]);

  return Canvas;
}(_react.Component);

Canvas.propTypes = {
  className: _propTypes2.default.string,
  style: _propTypes2.default.shape(),
  canvasClassName: _propTypes2.default.string,
  canvasStyle: _propTypes2.default.shape(),
  onResize: _propTypes2.default.func
};

Canvas.defaultProps = {
  className: "",
  style: {},
  canvasClassName: "",
  canvasStyle: {},
  onResize: function onResize() {}
};

exports.default = Canvas;