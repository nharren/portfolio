'use strict';

var app = app || {};

(function(module) {
  var snakeView = {};

  snakeView.showPage = function() {
    app.view.showPage('snake');
  }

  module.snakeView = snakeView;
})(app);