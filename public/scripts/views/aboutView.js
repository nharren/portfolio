'use strict';

var app = app || {};

(function(module) {
  var aboutView = {};

  aboutView.showPage = function() {
    app.view.showPage('about');
  }

  module.aboutView = aboutView;
})(app);