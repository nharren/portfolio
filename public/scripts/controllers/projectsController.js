'use strict';

var app = app || {};

(function(module) {
  const projectsController = {};

  projectsController.loadAll = function(ctx, next) {
    app.snake.dispose();

    let setProjects =  () => {
      ctx.projects = app.Project.all;
      next();
    };

    app.Project.fetchAll(setProjects);
  }

  projectsController.showPage = function(ctx) {
    app.view.init();
    app.projectsView.init(ctx.projects);
  }

  module.projectsController = projectsController;
})(app);