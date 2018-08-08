'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.distanceRect = distanceRect;
exports.closestRect = closestRect;
exports.getDelta = getDelta;
exports.updateDistanceBetweenContainers = updateDistanceBetweenContainers;

var _utils = require('../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function distanceRect(x, y, rect) {
  var dx = x - (0, _utils.clamp)(x, rect.left, rect.right);
  var dy = y - (0, _utils.clamp)(y, rect.top, rect.bottom);

  return Math.sqrt(dx * dx + dy * dy);
}

function closestRect(x, y, containers) {
  var distances = containers.map(function (c) {
    return distanceRect(x, y, c.getBoundingClientRect());
  });

  return distances.indexOf(Math.min.apply(Math, _toConsumableArray(distances)));
}

function getDelta(rect1, rect2) {
  return {
    x: rect1.left - rect2.left,
    y: rect1.top - rect2.top
  };
}

function updateDistanceBetweenContainers(distance, container1, container2) {
  var x = distance.x,
      y = distance.y;

  var d = getDelta.apply(undefined, _toConsumableArray([container1, container2].map(function (c) {
    return c.container.getBoundingClientRect();
  })));
  var scrollDX = container2.scrollContainer.scrollLeft - container1.scrollContainer.scrollLeft;
  var scrollDY = container2.scrollContainer.scrollTop - container1.scrollContainer.scrollTop;

  return {
    x: x + d.x + scrollDX,
    y: y + d.y + scrollDY
  };
}