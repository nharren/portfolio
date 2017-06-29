'use strict';

var app = app || {};

(function(module) {
  function Project(projectData) {
    Object.keys(projectData).forEach(k => this[k] = projectData[k]);
  }

  Project.all = [];

  Project.prototype.toHtml = function() {
    var template = $('#project-template').html();
    var templateRender = Handlebars.compile(template);
    return templateRender(this);
  };

  Project.fetchAll = function(callback) {
    if (Project.all.length > 0) {
      callback();
      return;
    }
    
    $.getJSON('http://nharren.herokuapp.com/projects')
     .then(projectsData => {
       Project.all = projectsData.map(d => new Project(d));
       callback();
     }, processError);
  }

  function processError(error) {
    console.error('Error:', error);
  }

  module.Project = Project;
})(app);


