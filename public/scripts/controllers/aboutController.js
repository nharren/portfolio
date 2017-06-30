'use strict';

var app = app || {};

(function(module) {
  const aboutController = {};

  aboutController.showPage = function() {
    app.view.init();
    app.snake.dispose();
    app.aboutView.showPage();
  }

  module.aboutController = aboutController;
})(app);