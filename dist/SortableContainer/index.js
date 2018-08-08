'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = sortableContainer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _findIndex = require('lodash/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

var _DragLayer = require('../DragLayer');

var _DragLayer2 = _interopRequireDefault(_DragLayer);

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _utils = require('../utils');

var _utils2 = require('../DragLayer/utils');

var _index = require('../index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Export Higher Order Sortable Container Component
function sortableContainer(WrappedComponent) {
  var _class, _temp;

  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { withRef: false };

  return _temp = _class = function (_Component) {
    _inherits(_class, _Component);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this.checkActiveIndex = function () {
        var active = _this.manager.active;


        if (!active) {
          return;
        }

        var _ref = _this.state || _this.props,
            items = _ref.items;

        var item = _this.manager.active.item;

        var newIndex = void 0;

        if (_typeof(items[0]) === 'object') {
          newIndex = (0, _findIndex2.default)(items, item);
        } else {
          newIndex = items.indexOf(item);
        }
        if (newIndex === -1) {
          _this.dragLayer.stopDrag();

          return;
        }
        _this.manager.active.index = newIndex;
        _this.index = newIndex;
      };

      _this.handleStart = function (e) {
        _this.dragLayer.startContainerID = _this.props.id;
        var p = (0, _utils.getOffset)(e);
        var _this$props = _this.props,
            distance = _this$props.distance,
            shouldCancelStart = _this$props.shouldCancelStart;
        var items = _this.state.items;


        if (e.button === 2 || shouldCancelStart(e)) {
          return false;
        }

        _this._touched = true;
        _this._pos = p;

        var node = (0, _utils.closest)(e.target, function (el) {
          return el.sortableInfo != null;
        });

        if (node && node.sortableInfo && _this.nodeIsChild(node) && !_this.state.sorting) {
          var useDragHandle = _this.props.useDragHandle;
          var _node$sortableInfo = node.sortableInfo,
              index = _node$sortableInfo.index,
              collection = _node$sortableInfo.collection;


          if (useDragHandle && !(0, _utils.closest)(e.target, function (el) {
            return el.sortableHandle != null;
          })) {
            return;
          }

          _this.manager.active = { index: index, collection: collection, item: items[index]

            /*
            * Fixes a bug in Firefox where the :active state of anchor tags
            * prevent subsequent 'mousemove' events from being fired
            * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
            */
          };if (e.target.tagName.toLowerCase() === 'a') {
            e.preventDefault();
          }

          if (!distance) {
            if (_this.props.pressDelay === 0) {
              _this.handlePress(e);
            } else {
              _this.pressTimer = setTimeout(function () {
                return _this.handlePress(e);
              }, _this.props.pressDelay);
            }
          }
        }
      };

      _this.nodeIsChild = function (node) {
        return node.sortableInfo.manager === _this.manager;
      };

      _this.handleMove = function (e) {
        var _this$props2 = _this.props,
            distance = _this$props2.distance,
            pressThreshold = _this$props2.pressThreshold;

        var p = (0, _utils.getOffset)(e);

        if (!_this.state.sorting && _this._touched) {
          _this._delta = {
            x: _this._pos.x - p.x,
            y: _this._pos.y - p.y
          };
          var delta = Math.abs(_this._delta.x) + Math.abs(_this._delta.y);

          if (!distance && (!pressThreshold || pressThreshold) && delta >= pressThreshold) {
            clearTimeout(_this.cancelTimer);
            _this.cancelTimer = setTimeout(_this.cancel, 0);
          } else if (distance && delta >= distance && _this.manager.isActive()) {
            _this.handlePress(e);
          }
        }
      };

      _this.handleEnd = function () {
        var distance = _this.props.distance;


        _this._touched = false;

        if (!distance) {
          _this.cancel();
        }
      };

      _this.cancel = function () {
        if (!_this.state.sorting) {
          clearTimeout(_this.pressTimer);
          _this.manager.active = null;
        }
      };

      _this.handlePress = function (e) {
        var activeNode = null;

        if (_this.dragLayer.helper) {
          if (_this.manager.active) {
            _this.checkActiveIndex();
            activeNode = _this.manager.getActive();
          }
        } else {
          activeNode = _this.dragLayer.startDrag(_this.document.body, _this, e);
          if (_this.props.isMultiple) {
            _this.startMultipleDrag(activeNode);
          }
          _this.dragLayer.createHelper(_this.document.body, _this);
        }

        if (activeNode) {
          var _this$props3 = _this.props,
              axis = _this$props3.axis,
              helperClass = _this$props3.helperClass,
              hideSortableGhost = _this$props3.hideSortableGhost,
              onSortStart = _this$props3.onSortStart;
          var _activeNode = activeNode,
              node = _activeNode.node,
              collection = _activeNode.collection;
          var index = node.sortableInfo.index;


          _this.index = index;
          _this.newIndex = index;
          _this.axis = {
            x: axis.indexOf('x') >= 0,
            y: axis.indexOf('y') >= 0
          };

          _this.initialScroll = {
            top: _this.scrollContainer.scrollTop,
            left: _this.scrollContainer.scrollLeft
          };

          _this.initialWindowScroll = {
            top: window.scrollY,
            left: window.scrollX
          };

          if (hideSortableGhost) {
            _this.sortableGhost = node;
            node.style.visibility = 'hidden';
            node.style.opacity = 0;
          }

          if (helperClass && !_this.props.isMultiple) {
            var _this$dragLayer$helpe;

            (_this$dragLayer$helpe = _this.dragLayer.helper.classList).add.apply(_this$dragLayer$helpe, _toConsumableArray(helperClass.split(' ')));
          }

          _this.setState({
            sorting: true,
            sortingIndex: index
          });

          if (onSortStart) {
            onSortStart({ node: node, index: index, collection: collection }, e);
          }
          _this.dragLayer.updateDistanceBetweenContainers();
        }
      };

      _this.startMultipleDrag = function (activeNode) {
        var index = activeNode.node.sortableInfo.index;

        if (_this.manager.selected.indexOf(index) === -1) {
          _this.manager.selected.push(index);
        }
        var selectedItems = [];

        _this.dragLayer.dragableItems = [];
        _this.dragLayer.lists.forEach(function (list) {
          var items = [];

          for (var i = 0; i < list.props.items.length; i++) {
            if (list.manager.selected.indexOf(i) !== -1) {
              selectedItems.push(list.props.items[i]);
              _this.dragLayer.dragableItems.push({
                listId: list.props.id,
                id: i
              });
            } else {
              items.push(list.props.items[i]);
            }
            if (list === _this && i === activeNode.node.sortableInfo.index) {
              items.push(list.props.items[i]);
            }
          }
          list.setState({
            items: items
          });
          list.manager.selected = [];
        });
        var items = _this.state.items.slice();

        items[index] = {
          selectedItems: selectedItems
        };
        _this.setState({
          items: items
        });
        _this.manager.active.item = items[index];
      };

      _this.handleSortMove = function (e) {
        var onSortMove = _this.props.onSortMove;

        // animate nodes if required

        if (_this.checkActive(e)) {
          _this.animateNodes();
          _this.autoscroll();
        }

        if (onSortMove) {
          onSortMove(e);
        }
      };

      _this.handleSortEnd = function (e) {
        var newList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var _this$props4 = _this.props,
            hideSortableGhost = _this$props4.hideSortableGhost,
            onSortEnd = _this$props4.onSortEnd,
            onMultipleSortEnd = _this$props4.onMultipleSortEnd;


        if (!_this.manager.active) {
          console.warn('there is no active node', e);

          return;
        }
        var collection = _this.manager.active.collection;


        if (hideSortableGhost && _this.sortableGhost) {
          _this.sortableGhost.style.visibility = '';
          _this.sortableGhost.style.opacity = '';
        }

        var nodes = _this.manager.refs[collection];

        for (var i = 0, len = nodes.length; i < len; i++) {
          var node = nodes[i];
          var el = node.node;

          // Clear the cached offsetTop / offsetLeft value
          node.edgeOffset = null;

          // Remove the transforms / transitions
          el.style[_utils.vendorPrefix + 'Transform'] = '';
          el.style[_utils.vendorPrefix + 'TransitionDuration'] = '';
        }

        // Stop autoscroll
        clearInterval(_this.autoscrollInterval);
        _this.autoscrollInterval = null;

        // Update state

        _this.setState({
          sorting: false,
          sortingIndex: null
        });
        if (newList) {
          if (!newList.manager.active) {
            newList.manager.active = {};
          }
          newList.manager.active.item = _this.manager.active.item;
          _this.newIndex = newList.getClosestNodeIndexHack(e);
          newList.handleSortSwap(_this.newIndex, _this.state.items[_this.index]);
          _this.setState({
            items: (0, _index.arrayMove)(_this.state.items, _this.index, -1)
          });
        } else if (!_this.props.isMultiple) {
          if (typeof onSortEnd === 'function') {
            onSortEnd({
              oldIndex: _this.dragLayer.startItemID,
              newIndex: _this.newIndex,
              collection: collection,
              oldListIndex: _this.dragLayer.startContainerID,
              newListIndex: _this.props.id
            }, e);
          }
        } else if (typeof onMultipleSortEnd === 'function') {
          onMultipleSortEnd({
            newIndex: _this.newIndex,
            newListIndex: _this.props.id,
            items: _this.dragLayer.dragableItems
          }, e);
        }

        _this._touched = false;
      };

      _this.handleSortSwap = function (index, item) {
        _this.setState({
          items: (0, _index.arrayInsert)(_this.state.items, index, item)
        });
        var onSortSwap = _this.props.onSortSwap;


        if (typeof onSortSwap === 'function') {
          onSortSwap({
            index: index,
            item: item
          });
        }
        _this.checkActiveIndex();
      };

      _this.getClosestNode = function (e) {
        var p = (0, _utils.getOffset)(e);
        // eslint-disable-next-line
        var closestNodes = [];
        // eslint-disable-next-line
        var closestCollections = [];
        // TODO: keys is converting number to string!!! check origin value type as number???
        Object.keys(_this.manager.refs).forEach(function (collection) {
          var nodes = _this.manager.refs[collection].map(function (n) {
            return n.node;
          });

          if (nodes && nodes.length > 0) {
            closestNodes.push(nodes[(0, _utils2.closestRect)(p.x, p.y, nodes)]);
            closestCollections.push(collection);
          }
        });
        var index = (0, _utils2.closestRect)(p.x, p.y, closestNodes);
        var collection = closestCollections[index];

        if (collection === undefined) {
          return {
            collection: collection,
            index: 0
          };
        }
        var finalNodes = _this.manager.refs[collection].map(function (n) {
          return n.node;
        });
        var finalIndex = finalNodes.indexOf(closestNodes[index]);
        var node = closestNodes[index];
        // TODO: add better support for grid
        var rect = node.getBoundingClientRect();

        return {
          collection: collection,
          index: finalIndex + (p.y > rect.bottom ? 1 : 0)
        };
      };

      _this.checkActive = function (e) {
        var active = _this.manager.active;

        if (!active) {
          // find closest collection
          var node = (0, _utils.closest)(e.target, function (el) {
            return el.sortableInfo != null;
          });

          if (node && node.sortableInfo) {
            var p = (0, _utils.getOffset)(e);
            var collection = node.sortableInfo.collection;

            var nodes = _this.manager.refs[collection].map(function (n) {
              return n.node;
            });
            // find closest index in collection

            if (nodes) {
              var index = (0, _utils2.closestRect)(p.x, p.y, nodes);

              _this.manager.active = {
                index: index,
                collection: collection,
                item: _this.state.items[index]
              };
              _this.handlePress(e);
            }
          }

          return false;
        }

        return true;
      };

      _this.autoscroll = function () {
        var translate = _this.dragLayer.translate;
        var direction = {
          x: 0,
          y: 0
        };
        var speed = {
          x: 1,
          y: 1
        };
        var acceleration = {
          x: 10,
          y: 10
        };

        if (translate.y >= _this.dragLayer.maxTranslate.y - _this.dragLayer.height / 2) {
          direction.y = 1; // Scroll Down
          speed.y = acceleration.y * Math.abs((_this.dragLayer.maxTranslate.y - _this.dragLayer.height / 2 - translate.y) / _this.dragLayer.height);
        } else if (translate.x >= _this.dragLayer.maxTranslate.x - _this.dragLayer.width / 2) {
          direction.x = 1; // Scroll Right
          speed.x = acceleration.x * Math.abs((_this.dragLayer.maxTranslate.x - _this.dragLayer.width / 2 - translate.x) / _this.dragLayer.width);
        } else if (translate.y <= _this.dragLayer.minTranslate.y + _this.dragLayer.height / 2) {
          direction.y = -1; // Scroll Up
          speed.y = acceleration.y * Math.abs((translate.y - _this.dragLayer.height / 2 - _this.dragLayer.minTranslate.y) / _this.dragLayer.height);
        } else if (translate.x <= _this.dragLayer.minTranslate.x + _this.dragLayer.width / 2) {
          direction.x = -1; // Scroll Left
          speed.x = acceleration.x * Math.abs((translate.x - _this.dragLayer.width / 2 - _this.dragLayer.minTranslate.x) / _this.dragLayer.width);
        }

        if (_this.autoscrollInterval) {
          clearInterval(_this.autoscrollInterval);
          _this.autoscrollInterval = null;
          _this.isAutoScrolling = false;
        }

        if (direction.x !== 0 || direction.y !== 0) {
          _this.autoscrollInterval = setInterval(function () {
            _this.isAutoScrolling = true;
            var offset = {
              left: 1 * speed.x * direction.x,
              top: 1 * speed.y * direction.y
            };

            _this.dragLayer.scrollContainer.scrollTop += offset.top;
            _this.dragLayer.scrollContainer.scrollLeft += offset.left;
            // this.dragLayer.translate.x += offset.left;
            // this.dragLayer.translate.y += offset.top;
            _this.animateNodes();
          }, 5);
        }
      };

      _this.dragLayer = props.dragLayer || new _DragLayer2.default();
      _this.dragLayer.addRef(_this);
      _this.dragLayer.onDragEnd = props.onDragEnd;
      _this.manager = new _Manager2.default();
      _this.events = {
        start: _this.handleStart,
        move: _this.handleMove,
        end: _this.handleEnd
      };
      if (_this.props.isMultiple) {
        _this.manager.helperClass = props.helperClass;
        _this.manager.isMultiple = true;
      }

      (0, _invariant2.default)(!(props.distance && props.pressDelay), 'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.');

      _this.state = {
        items: props.items
      };
      return _this;
    }

    _createClass(_class, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          manager: this.manager
        };
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var _props = this.props,
            contentWindow = _props.contentWindow,
            getContainer = _props.getContainer,
            useWindowAsScrollContainer = _props.useWindowAsScrollContainer;


        this.container = typeof getContainer === 'function' ? getContainer(this.getWrappedInstance()) : (0, _reactDom.findDOMNode)(this);
        this.document = this.container.ownerDocument || document;
        this.scrollContainer = useWindowAsScrollContainer ? this.document.body : this.container;
        this.initialScroll = {
          top: this.scrollContainer.scrollTop,
          left: this.scrollContainer.scrollLeft
        };
        this.contentWindow = typeof contentWindow === 'function' ? contentWindow() : contentWindow;

        var _loop = function _loop(key) {
          if (_this2.events.hasOwnProperty(key)) {
            _utils.events[key].forEach(function (eventName) {
              return _this2.container.addEventListener(eventName, _this2.events[key], false);
            });
          }
        };

        for (var key in this.events) {
          _loop(key);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _this3 = this;

        this.dragLayer.removeRef(this);

        var _loop2 = function _loop2(key) {
          if (_this3.events.hasOwnProperty(key)) {
            _utils.events[key].forEach(function (eventName) {
              return _this3.container.removeEventListener(eventName, _this3.events[key]);
            });
          }
        };

        for (var key in this.events) {
          _loop2(key);
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.setState({
          items: nextProps.items
        });
      }
    }, {
      key: 'getClosestNodeIndexHack',
      value: function getClosestNodeIndexHack(e) {
        var _container$getBoundin = this.container.getBoundingClientRect(),
            top = _container$getBoundin.top,
            bottom = _container$getBoundin.bottom;

        var center = top + (bottom - top) / 2;
        var p = (0, _utils.getOffset)(e);

        if (p.y < center) {
          return 0;
        }

        return this.state.items.length;
      }
    }, {
      key: 'getEdgeOffset',
      value: function getEdgeOffset(node) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { top: 0, left: 0 };

        // Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
        if (node) {
          var nodeOffset = {
            top: offset.top + node.offsetTop,
            left: offset.left + node.offsetLeft
          };

          if (node.parentNode !== this.container) {
            return this.getEdgeOffset(node.parentNode, nodeOffset);
          }

          return nodeOffset;
        }
      }
    }, {
      key: 'getOffset',
      value: function getOffset(e) {
        return {
          x: e.touches ? e.touches[0].pageX : e.pageX,
          y: e.touches ? e.touches[0].pageY : e.pageY
        };
      }
    }, {
      key: 'getLockPixelOffsets',
      value: function getLockPixelOffsets() {
        var lockOffset = this.props.lockOffset;


        if (!Array.isArray(lockOffset)) {
          lockOffset = [lockOffset, lockOffset];
        }

        (0, _invariant2.default)(lockOffset.length === 2, 'lockOffset prop of SortableContainer should be a single ' + 'value or an array of exactly two values. Given %s', lockOffset);

        var _lockOffset = lockOffset,
            _lockOffset2 = _slicedToArray(_lockOffset, 2),
            minLockOffset = _lockOffset2[0],
            maxLockOffset = _lockOffset2[1];

        return [this.getLockPixelOffset(minLockOffset), this.getLockPixelOffset(maxLockOffset)];
      }
    }, {
      key: 'getLockPixelOffset',
      value: function getLockPixelOffset(lockOffset) {
        var offsetX = lockOffset;
        var offsetY = lockOffset;
        var unit = 'px';

        if (typeof lockOffset === 'string') {
          var match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

          (0, _invariant2.default)(match !== null, 'lockOffset value should be a number or a string of a ' + 'number followed by "px" or "%". Given %s', lockOffset);

          offsetX = offsetY = parseFloat(lockOffset);
          unit = match[1];
        }

        (0, _invariant2.default)(isFinite(offsetX) && isFinite(offsetY), 'lockOffset value should be a finite. Given %s', lockOffset);

        if (unit === '%') {
          offsetX = offsetX * this.dragLayer.width / 100;
          offsetY = offsetY * this.dragLayer.height / 100;
        }

        return {
          x: offsetX,
          y: offsetY
        };
      }
    }, {
      key: 'animateNodes',
      value: function animateNodes() {
        if (!this.axis) {
          return;
        }
        var _props2 = this.props,
            transitionDuration = _props2.transitionDuration,
            hideSortableGhost = _props2.hideSortableGhost;

        var nodes = this.manager.getOrderedRefs();
        var deltaScroll = {
          left: this.scrollContainer.scrollLeft - this.initialScroll.left,
          top: this.scrollContainer.scrollTop - this.initialScroll.top
        };

        var sortingOffset = {
          left: this.dragLayer.offsetEdge.left - this.dragLayer.distanceBetweenContainers.x + this.dragLayer.translate.x + deltaScroll.left,
          top: this.dragLayer.offsetEdge.top - this.dragLayer.distanceBetweenContainers.y + this.dragLayer.translate.y + deltaScroll.top
        };

        var scrollDifference = {
          top: window.scrollY - this.initialWindowScroll.top,
          left: window.scrollX - this.initialWindowScroll.left
        };

        this.newIndex = null;
        for (var i = 0, len = nodes.length; i < len; i++) {
          var node = nodes[i].node;

          var index = node.sortableInfo.index;
          // If the node is the one we're currently animating, skip it

          if (index === this.index) {
            if (hideSortableGhost) {
              /*
              * With windowing libraries such as `react-virtualized`, the sortableGhost
              * node may change while scrolling down and then back up (or vice-versa),
              * so we need to update the reference to the new node just to be safe.
              */
              this.sortableGhost = node;
              node.style.visibility = 'hidden';
              node.style.opacity = 0;
            }
            continue;
          }
          var width = node.offsetWidth;
          var height = node.offsetHeight;
          var offset = {
            width: this.dragLayer.width > width ? width / 2 : this.dragLayer.width / 2,
            height: height / 2
          };
          var translate = {
            x: 0,
            y: 0
          };
          var edgeOffset = nodes[i].edgeOffset;

          // If we haven't cached the node's offsetTop / offsetLeft value

          if (!edgeOffset) {
            nodes[i].edgeOffset = edgeOffset = this.getEdgeOffset(node);
          }

          // Get a reference to the next and previous node
          var nextNode = i < nodes.length - 1 && nodes[i + 1];
          var prevNode = i > 0 && nodes[i - 1];

          // Also cache the next node's edge offset if needed.
          // We need this for calculating the animation in a grid setup
          if (nextNode && !nextNode.edgeOffset) {
            nextNode.edgeOffset = this.getEdgeOffset(nextNode.node);
          }

          if (transitionDuration) {
            node.style[_utils.vendorPrefix + 'TransitionDuration'] = transitionDuration + 'ms';
          }
          if (this.axis.x) {
            if (this.axis.y) {
              // Calculations for a grid setup
              if (index < this.index && (sortingOffset.left + scrollDifference.left - offset.width <= edgeOffset.left && sortingOffset.top + scrollDifference.top <= edgeOffset.top + offset.height || sortingOffset.top + scrollDifference.top + offset.height <= edgeOffset.top)) {
                // If the current node is to the left on the same row, or above the node that's being dragged
                // then move it to the right
                translate.x = this.dragLayer.width + this.dragLayer.marginOffset.x;
                if (edgeOffset.left + translate.x > this.dragLayer.containerBoundingRect.width - offset.width) {
                  // If it moves passed the right bounds, then animate it to the first position of the next row.
                  // We just use the offset of the next node to calculate where to move, because that node's original position
                  // is exactly where we want to go
                  translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                  translate.y = nextNode.edgeOffset.top - edgeOffset.top;
                }
                if (this.newIndex === null) {
                  this.newIndex = index;
                }
              } else if (index > this.index && (sortingOffset.left + scrollDifference.left + offset.width >= edgeOffset.left && sortingOffset.top + scrollDifference.top + offset.height >= edgeOffset.top || sortingOffset.top + scrollDifference.top + offset.height >= edgeOffset.top + height)) {
                // If the current node is to the right on the same row, or below the node that's being dragged
                // then move it to the left
                translate.x = -(this.dragLayer.width + this.dragLayer.marginOffset.x);
                if (edgeOffset.left + translate.x < this.dragLayer.containerBoundingRect.left + offset.width) {
                  // If it moves passed the left bounds, then animate it to the last position of the previous row.
                  // We just use the offset of the previous node to calculate where to move, because that node's original position
                  // is exactly where we want to go
                  if (prevNode.edgeOffset || prevNode.edgeOffset === undefined) {
                    //7th August 2018
                    //Bug Found Added. code for first handing.
                    prevNode.edgeOffset = prevNode.edgeOffset || {
                      left: 0,
                      top: 0
                    };
                    translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                    translate.y = prevNode.edgeOffset.top - edgeOffset.top;
                  }
                }
                this.newIndex = index;
              }
            } else if (index > this.index && sortingOffset.left + scrollDifference.left + offset.width >= edgeOffset.left) {
              translate.x = -(this.dragLayer.width + this.dragLayer.marginOffset.x);
              this.newIndex = index;
            } else if (index < this.index && sortingOffset.left + scrollDifference.left <= edgeOffset.left + offset.width) {
              translate.x = this.dragLayer.width + this.dragLayer.marginOffset.x;

              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          } else if (this.axis.y) {
            if (index > this.index && sortingOffset.top + scrollDifference.top + this.dragLayer.height >= edgeOffset.top + offset.height) {

              translate.y = -(this.dragLayer.height + this.dragLayer.marginOffset.y);

              this.newIndex = index;
            } else if (index < this.index && sortingOffset.top + scrollDifference.top <= edgeOffset.top + offset.height) {
              translate.y = this.dragLayer.height + this.dragLayer.marginOffset.y;
              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          }

          node.style[_utils.vendorPrefix + 'Transform'] = 'translate3d(' + translate.x + 'px,' + translate.y + 'px,0)';
        }

        if (this.newIndex == null) {
          this.newIndex = this.index;
        }
      }
    }, {
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        (0, _invariant2.default)(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call');

        return this.refs.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        var ref = config.withRef ? 'wrappedInstance' : null;
        var props = _extends({}, (0, _utils.omit)(this.props, 'contentWindow', 'useWindowAsScrollContainer', 'distance', 'helperClass', 'hideSortableGhost', 'transitionDuration', 'useDragHandle', 'pressDelay', 'pressThreshold', 'shouldCancelStart', 'onSortStart', 'onSortSwap', 'onSortMove', 'onSortEnd', 'axis', 'lockAxis', 'lockOffset', 'lockToContainerEdges', 'getContainer', 'getHelperDimensions'));

        props.items = this.state.items;

        return _react2.default.createElement(
          'div',
          {
            style: {
              position: 'relative',
              userSelect: 'none'
            }
          },
          _react2.default.createElement(WrappedComponent, _extends({ ref: ref }, props))
        );
      }
    }]);

    return _class;
  }(_react.Component), _class.displayName = (0, _utils.provideDisplayName)('sortableList', WrappedComponent), _class.defaultProps = {
    axis: 'xy',
    transitionDuration: 300,
    pressDelay: 0,
    pressThreshold: 5,
    distance: 0,
    useWindowAsScrollContainer: false,
    hideSortableGhost: true,
    contentWindow: typeof window !== 'undefined' ? window : null,
    shouldCancelStart: function shouldCancelStart(e) {
      // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
      var disabledElements = ['input', 'textarea', 'select', 'option', 'button'];

      if (disabledElements.indexOf(e.target.tagName.toLowerCase()) !== -1) {
        return true; // Return true to cancel sorting
      }
    },
    lockToContainerEdges: false,
    lockOffset: '50%',
    getHelperDimensions: function getHelperDimensions(_ref2) {
      var node = _ref2.node;
      return {
        width: node.offsetWidth,
        height: node.offsetHeight
      };
    }
  }, _class.propTypes = {
    axis: _propTypes2.default.oneOf(['x', 'y', 'xy']),
    distance: _propTypes2.default.number,
    dragLayer: _propTypes2.default.object,
    lockAxis: _propTypes2.default.string,
    helperClass: _propTypes2.default.string,
    transitionDuration: _propTypes2.default.number,
    contentWindow: _propTypes2.default.any,
    onSortStart: _propTypes2.default.func,
    onSortMove: _propTypes2.default.func,
    onSortEnd: _propTypes2.default.func,
    onDragEnd: _propTypes2.default.func,
    shouldCancelStart: _propTypes2.default.func,
    pressDelay: _propTypes2.default.number,
    useDragHandle: _propTypes2.default.bool,
    useWindowAsScrollContainer: _propTypes2.default.bool,
    hideSortableGhost: _propTypes2.default.bool,
    lockToContainerEdges: _propTypes2.default.bool,
    lockOffset: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]))]),
    getContainer: _propTypes2.default.func,
    getHelperDimensions: _propTypes2.default.func
  }, _class.childContextTypes = {
    manager: _propTypes2.default.object.isRequired
  }, _temp;
}