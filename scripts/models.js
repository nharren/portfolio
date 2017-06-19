'use strict';

var projects = [];

function Project(projectData) {
  for (var property in projectData) {
    this[property] = projectData[property];
  }
}

Project.prototype.toHtml = function() {
  var template = $('#project-template').html();
  var templateRender = Handlebars.compile(template);
  return templateRender(this);
};

projectsData.sort(function(a,b) {
  return (new Date(b.dateCreated)) - (new Date(a.dateCreated));
});

projectsData.forEach(function(projectData){
  projects.push(new Project(projectData));
});

projects.forEach(function(project){
  $('#projects').append(project.toHtml());
});
