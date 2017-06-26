'use strict';

var app = app || {};

(function(module) {
  const projectsController = {};
  
  projectsController.showPage = () => {
    $('section').hide();
    $('#projects').fadeIn(150);
  }

  module.projectsController = projectsController;
})(app);