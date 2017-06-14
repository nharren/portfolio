'use strict';

// function codeSample(title, image, description) {
//   this.title = title;
//   this.image = image;
//   this.description = description;
// }

function project(title, image, link, dateCreated, description) {
  this.title = title;
  this.image = image;
  this.link = link;
  this.dateCreated = dateCreated;
  this.description = description;
}


var projects = [
    new project("Portfolio", null, "https://github.com/nharren/301-portfolio", "2017-06-12", "A portfolio assignment for Codefellows 301."),
    new project("nharren.github.io", null, "https://github.com/nharren/nharren.github.io", "2017-05-25", "A music trivia website.")
]

projects.sort(function(a,b) {
    return (new Date(b.dateCreated)) - (new Date(a.dateCreated));
});

project.prototype.toHtml = function() {
    var $projectTemplate = $('project-template');
    var $project = $projectTemplate.clone();
    $project.css('display','inline-block');

    // TODO: Fill in template.

    return $project;
}
