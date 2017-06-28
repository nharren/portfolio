'use strict';

var app = app || {};

(function(module) {
  const projectsController = {};

  projectsController.showPage = () => {
    app.view.init();
    app.snake.dispose();
    app.Project.fetchAll(app.projectsView.init);
  }

  module.projectsController = projectsController;
})(app);