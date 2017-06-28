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

  let initView;

  Project.fetchAll = function(callback) {
    if (Project.all.length > 0) {
      callback();
      return;
    }

    initView = callback;
    $.getJSON('../../data/data.json').then(processLocalProjectsData, processError);
  }

  function processError(error) {
    console.error('Error:', error);
  }

  function processLocalProjectsData(projectsData) {
    Project.all = projectsData.map(d => new Project(d));

    $.ajax({
      method: 'GET',
      url: 'https://api.github.com/users/nharren/repos',
      headers: {
        Authorization: app.githubToken
      }
    })
    .then(processRemoteProjectsData, processError);
  }

  function processRemoteProjectsData(githubReposData) {
    let current = 0;

    Project.all.forEach(function(project) {
      let githubRepoData = githubReposData.filter(d => d.id === project.githubId);

      if (githubRepoData.length === 0) {
        console.error('Could not find GitHub repo with id ' + project.githubId + '.');
      } else {
        githubRepoData = githubRepoData[0];
        project.description = githubRepoData.description;
        project.url = githubRepoData.html_url;
      }

      current++;
      if (current === Project.all.length) {
        initView();
        initView = null;
      }
    });
  }

  module.Project = Project;
})(app);


