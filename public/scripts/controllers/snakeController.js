'use strict';

var app = app || {};

(function(module) {
  const snakeController = {};

  snakeController.showPage = () => {
    app.projectView.showPage('snake');
  }

  module.snakeController = snakeController;
})(app);