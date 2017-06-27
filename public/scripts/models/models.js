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

  Project.loadAll = function(projectsData) {
    projectsData.sort(function(a,b) {
      return (new Date(b.dateCreated)) - (new Date(a.dateCreated));
    });

    projectsData.forEach(function(projectData){
      Project.all.push(new Project(projectData));
    });
  }

  Project.fetchAll = function() {
    $.getJSON('../data/data.json')
    .then(function(projectsData){
      Project.loadAll(projectsData);
      app.projectView.init();
    }, function(err) {
      console.error('Error:', err);
    })
  }

  module.Project = Project;
})(app);


