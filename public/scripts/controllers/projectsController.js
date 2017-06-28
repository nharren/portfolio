'use strict';

var app = app || {};

(function(module) {
  const projectsController = {};

  projectsController.showPage = () => {
    app.view.init();
    
    if (app.snake.initialized) {
      app.snake.dispose();
    }

    if (app.Project.all.length === 0) {
      app.Project.fetchAll(app.projectsView.init);
    }
  }

  module.projectsController = projectsController;
})(app);