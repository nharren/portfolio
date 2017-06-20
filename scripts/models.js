'use strict';

function Project(projectData) {
  for (var property in projectData) {
    this[property] = projectData[property];
  }
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
    projectView.init();
  }, function(err) {
    console.error('my stuff broke:', err);
  })
}



