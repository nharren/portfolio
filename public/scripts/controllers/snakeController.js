'use strict';

var app = app || {};

(function(module) {
  const snakeController = {};

  snakeController.showPage = () => {
    app.view.init();
    app.snakeView.showPage();
    app.snake.initialize();
  }

  module.snakeController = snakeController;
})(app);