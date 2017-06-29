'use strict';

var app = app || {};

(function(module) {
  var projectsView = {};

  let initialized = false;

  projectsView.showPage = function() {
    app.view.showPage('projects');
  }

  projectsView.setTeasers = function() {
    $('.project-details').hide();

    $('#projects').on('click','.project-header', function(event) {
      var $projectHeader = $(this);
      $projectHeader.prev('.project-details').slideToggle();

      var $arrow = $projectHeader.children('.project-title-arrow');
      $arrow.toggleClass('expanded');
      $arrow.toggleClass('collapsed');

      event.preventDefault();
    });
  };

  projectsView.populateFilter = function() {
    var $filter = $('.filter-dropdown');
    var technologies = [];
    app.Project.all.forEach(function(project) {
      project.technologies.forEach(function(technology) {
        technologies.push(technology);
      });
    });

    technologies.sort();
    technologies = new Set(technologies);

    technologies.forEach(function(technology) {
      let technologyCount = app.Project.all.map(p => p.technologies)
                                           .filter(p => p.includes(technology))
                                           .reduce(acc => acc + 1,0);
      $filter.append($(`<div class="filter-item" data-technology="${technology}">${technology} (${technologyCount})</div>`));
    });
  }

  projectsView.handleFilter = function() {
    $('.filter-selection').on('click', function() {
      $('.filter-dropdown').slideToggle(200);
    });

    $('.filter-item').on('mousedown', function(){
      $('.filter-dropdown').toggle();
      var technology = $(this).data('technology');
      if ($(this).index() !== 0) {
        $('.project').hide();
        $('.project').each(function() {
          $(this).find('.project-technology').get().forEach(s => {
            if (s.innerText.includes(technology)) {
              $(this).fadeIn();
            }
          });
        });
      } else {
        $('.project').fadeIn();
      }

      $('.filter-selection').text(technology);
    });
  }

  projectsView.addProjects = function() {
    app.Project.all.forEach(function(project){
      $('#projects').append(project.toHtml());
    });
  }

  projectsView.init = function() {
    if (!initialized) {
      projectsView.setTeasers();
      projectsView.addProjects();
      projectsView.populateFilter();
      projectsView.handleFilter();
      initialized = true;
    }
  
    projectsView.showPage();
  };

  module.projectsView = projectsView;
})(app);