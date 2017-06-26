'use strict';

var app = app || {};

(function(module) {
  const aboutController = {};

  aboutController.showPage = () => {
    $('section').hide();
    $('#about').fadeIn(150);
  }

  module.aboutController = aboutController;
})(app);