'use strict';

var app = app || {};

(function(module) {
  const aboutController = {};

  aboutController.showPage = () => {
    app.projectView.showPage('about');
  }

  module.aboutController = aboutController;
})(app);