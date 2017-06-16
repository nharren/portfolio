'use strict';

var projects = [];

function Project(projectData) {
  for (var property in projectData) {
    this[property] = projectData[property];
  }
}

Project.prototype.toHtml = function() {
  var $projectTemplate = $('.template');
  var $project = $projectTemplate.clone();
  $project.removeClass('template');
  $project.css('display','inline-block');
  $project.find('.project-title').html(this.title);
  $project.find('.project-date-created').html(this.date);
  $project.find('.project-description').html(this.description);
  $project.find('.project-link').attr('href', this.link);
  return $project;
};

projectsData.sort(function(a,b) {
  return (new Date(b.dateCreated)) - (new Date(a.dateCreated));
});

projectsData.forEach(function(projectData){
  projects.push(new Project(projectData));
});

projects.forEach(function(project){
  $('.projects-container').append(project.toHtml());
});
