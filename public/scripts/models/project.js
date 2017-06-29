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
    
    $.getJSON('./project')
     .then(projectsData => {
       Project.all = projectsData.map(d => new Project(d));
       fetchTechnologies(callback)
     }, processError);
  }

  function fetchTechnologies(callback) {
    $.getJSON('./technology')
    .then(function(technologyData) {
      Project.all = Project.all.map(function(project) {
        project.technologies = project.technologies.map(function(technologyId) {
          return technologyData.rows.find(r => r.technology_id === technologyId).name;
        })
        return project;
      });

      callback();
    }, processError);
  }

  function processError(error) {
    console.error('Error:', error);
  }

  module.Project = Project;
})(app);


