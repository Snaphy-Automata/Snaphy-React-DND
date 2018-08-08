'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _utils2 = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var oldy = Infinity;

var DragLayer = function () {
  function DragLayer() {
    var _this = this;

    _classCallCheck(this, DragLayer);

    this.helper = null;
    this.lists = [];

    this.handleSortMove = function (e) {
      e.preventDefault(); // Prevent scrolling on mobile
      _this.updatePosition(e);
      _this.updateTargetContainer(e);
      if (_this.currentList) {
        _this.currentList.handleSortMove(e);
      }
    };

    this.handleSortEnd = function (e) {
      if (_this.listenerNode) {
        _utils.events.move.forEach(function (eventName) {
          return _this.listenerNode.removeEventListener(eventName, _this.handleSortMove);
        });
        _utils.events.end.forEach(function (eventName) {
          return _this.listenerNode.removeEventListener(eventName, _this.handleSortEnd);
        });
      }

      if (typeof _this.onDragEnd === 'function') {
        _this.onDragEnd();
      }
      // Remove the helper from the DOM
      if (_this.helper) {
        _this.helper.parentNode.removeChild(_this.helper);
        _this.helper = null;
        _this.currentList.handleSortEnd(e);
      }
    };
  }

  _createClass(DragLayer, [{
    key: 'addRef',
    value: function addRef(list) {
      this.lists.push(list);
    }
  }, {
    key: 'removeRef',
    value: function removeRef(list) {
      var i = this.lists.indexOf(list);

      if (i !== -1) {
        this.lists.splice(i, 1);
      }
    }
  }, {
    key: 'startDrag',
    value: function startDrag(parent, list, e) {
      var _this2 = this;

      var offset = (0, _utils.getOffset)(e);
      var activeNode = list.manager.getActive();

      this.scrollContainer = this.getScrollContainer(activeNode.node);
      if (!this.scrollContainer) {
        this.scrollContainer = list.container;
      }
      if (activeNode) {
        var axis = list.props.axis;
        var node = activeNode.node;
        var index = node.sortableInfo.index;


        this.startItemID = index;
        var margin = (0, _utils.getElementMargin)(node);
        var containerBoundingRect = list.container.getBoundingClientRect();

        this.marginOffset = {
          x: margin.left + margin.right,
          y: Math.max(margin.top, margin.bottom)
        };
        this.boundingClientRect = node.getBoundingClientRect();
        this.containerBoundingRect = containerBoundingRect;
        this.currentList = list;

        this.axis = {
          x: axis.indexOf('x') >= 0,
          y: axis.indexOf('y') >= 0
        };
        this.initialOffset = offset;
        this.distanceBetweenContainers = {
          x: 0,
          y: 0
        };

        this.listenerNode = e.touches ? node : list.contentWindow;
        _utils.events.move.forEach(function (eventName) {
          return _this2.listenerNode.addEventListener(eventName, _this2.handleSortMove, false);
        });
        _utils.events.end.forEach(function (eventName) {
          return _this2.listenerNode.addEventListener(eventName, _this2.handleSortEnd, false);
        });

        return activeNode;
      }

      return false;
    }
  }, {
    key: 'createHelper',
    value: function createHelper(parent, list) {
      var _list$manager$getActi = list.manager.getActive(),
          node = _list$manager$getActi.node,
          collection = _list$manager$getActi.collection;

      var index = node.sortableInfo.index;

      var fields = node.querySelectorAll('input, textarea, select');
      var clonedNode = node.cloneNode(true);
      var margin = (0, _utils.getElementMargin)(node);
      var dimensions = list.props.getHelperDimensions({
        index: index,
        node: node,
        collection: collection
      });

      this.width = dimensions.width;
      this.height = dimensions.height;
      var clonedFields = [].concat(_toConsumableArray(clonedNode.querySelectorAll('input, textarea, select'))); // Convert NodeList to Array

      this.offsetEdge = this.currentList.getEdgeOffset(node);

      clonedFields.forEach(function (field, index) {
        if (field.type !== 'file' && fields[index]) {
          field.value = fields[index].value;
        }
      });

      this.helper = parent.appendChild(clonedNode);
      this.helper.style.position = 'fixed';

      this.helper.style.top = this.boundingClientRect.top - margin.top + 'px';
      this.helper.style.left = this.boundingClientRect.left - margin.left + 'px';
      this.helper.style.width = this.width + 'px';
      this.helper.style.height = this.height + 'px';
      this.helper.style.boxSizing = 'border-box';
      this.helper.style.pointerEvents = 'none';

      var useWindowAsScrollContainer = list.props.useWindowAsScrollContainer;

      var containerBoundingRect = this.scrollContainer.getBoundingClientRect();

      this.minTranslate = {};
      this.maxTranslate = {};
      if (this.axis.x) {
        this.minTranslate.x = (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) - this.boundingClientRect.left - this.width / 2;
        this.maxTranslate.x = (useWindowAsScrollContainer ? list.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - this.boundingClientRect.left - this.width / 2;
      }
      if (this.axis.y) {
        this.minTranslate.y = (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) - this.boundingClientRect.top - this.height / 2;
        this.maxTranslate.y = (useWindowAsScrollContainer ? list.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - this.boundingClientRect.top - this.height / 2;
      }
    }
  }, {
    key: 'stopDrag',
    value: function stopDrag() {
      this.handleSortEnd();
    }
  }, {
    key: 'updatePosition',
    value: function updatePosition(e) {
      var _currentList$props = this.currentList.props,
          lockAxis = _currentList$props.lockAxis,
          lockToContainerEdges = _currentList$props.lockToContainerEdges;

      var offset = (0, _utils.getOffset)(e);
      var translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y
        // Adjust for window scroll

      };if (this.currentList.initialWindowScroll) {
        translate.y -= window.scrollY - this.currentList.initialWindowScroll.top;
        translate.x -= window.scrollX - this.currentList.initialWindowScroll.left;
      }

      this.translate = translate;
      this.delta = offset;

      if (lockToContainerEdges) {
        var _currentList$getLockP = this.currentList.getLockPixelOffsets(),
            _currentList$getLockP2 = _slicedToArray(_currentList$getLockP, 2),
            minLockOffset = _currentList$getLockP2[0],
            maxLockOffset = _currentList$getLockP2[1];

        var minOffset = {
          x: this.width / 2 - minLockOffset.x,
          y: this.height / 2 - minLockOffset.y
        };
        var maxOffset = {
          x: this.width / 2 - maxLockOffset.x,
          y: this.height / 2 - maxLockOffset.y
        };

        translate.x = (0, _utils.clamp)(translate.x, this.minTranslate.x + minOffset.x, this.maxTranslate.x - maxOffset.x);
        translate.y = (0, _utils.clamp)(translate.y, this.minTranslate.y + minOffset.y, this.maxTranslate.y - maxOffset.y);
      }

      if (lockAxis === 'x') {
        translate.y = 0;
      } else if (lockAxis === 'y') {
        translate.x = 0;
      }

      this.helper.style[_utils.vendorPrefix + 'Transform'] = 'translate3d(' + translate.x + 'px,' + translate.y + 'px, 0)';
    }
  }, {
    key: 'updateTargetContainer',
    value: function updateTargetContainer(e) {
      var _delta = this.delta,
          pageX = _delta.pageX,
          pageY = _delta.pageY;

      var helperCollision = this.currentList.props.helperCollision;

      if (helperCollision) {
        var _helper$getBoundingCl = this.helper.getBoundingClientRect(),
            top = _helper$getBoundingCl.top,
            bottom = _helper$getBoundingCl.bottom;

        if (pageY > oldy) {
          pageY = bottom + helperCollision.top;
        } else {
          pageY = top + helperCollision.top;
        }
      }
      oldy = e.pageY;
      var closest = this.lists[(0, _utils2.closestRect)(pageX, pageY, this.lists.map(function (l) {
        return l.container;
      }))];
      var item = this.currentList.manager.active.item;


      this.active = item;
      if (closest !== this.currentList) {
        this.distanceBetweenContainers = (0, _utils2.updateDistanceBetweenContainers)(this.distanceBetweenContainers, closest, this.currentList, {
          width: this.width,
          height: this.height
        });
        this.currentList.handleSortEnd(e, closest, { pageX: pageX, pageY: pageY });
        this.currentList = closest;
        this.currentList.manager.active = _extends({}, this.currentList.getClosestNode(e), {
          item: item
        });
        this.currentList.handlePress(e);
      }
    }
  }, {
    key: 'getScrollContainer',
    value: function getScrollContainer(listContainer) {
      var el = listContainer;

      while (el.parentNode) {
        if (el.style.overflow) {
          return el;
        }
        el = el.parentNode;
      }
    }
  }, {
    key: 'updateDistanceBetweenContainers',
    value: function updateDistanceBetweenContainers() {
      var containerCoordinates = this.currentList.container.getBoundingClientRect();

      this.distanceBetweenContainers = {
        x: containerCoordinates.left - this.containerBoundingRect.left,
        y: containerCoordinates.top - this.containerBoundingRect.top
      };
    }
  }]);

  return DragLayer;
}();

exports.default = DragLayer;