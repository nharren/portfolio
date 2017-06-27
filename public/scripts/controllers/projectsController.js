'use strict';

var app = app || {};

(function(module) {
  const projectsController = {};
  
  projectsController.showPage = () => {
    app.projectView.showPage('projects');
  }

  module.projectsController = projectsController;
})(app);