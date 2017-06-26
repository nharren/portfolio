'use strict';

var app = app || {};

(function(module) {
  var projectView = {};

  projectView.handleMainNav = function() {
    $('.menu-item').on('click', function(){
      if ($(this).hasClass('selected')) {
        return;
      }

      $('.tab-content').removeAttr('style');

      var $newTab = $(this);
      var $previousTab = $('.selected');

      var $previousTabContent = $('#' + $previousTab.data('content'));
      var $newTabContent = $('#' + $newTab.data('content'))

      $previousTab.removeClass('selected');
      $newTab.addClass('selected');

      $newTabContent.removeClass('hidden');

      if (window.innerWidth > 640) {
        var left;

        if ($newTab.index() > $previousTab.index()) {
          $newTabContent.addClass('slideLeft');
          left = '-100vw';
        } else {
          $newTabContent.addClass('slideRight');
          left = '100vw';
        }

        $previousTabContent.animate({left: left}, '1s', function() {
          $previousTabContent.addClass('hidden');
        });

        $newTabContent.animate({left: '0'}, function(){
          $newTabContent.removeClass('slideLeft slideRight');
        });
      } else {
        $previousTabContent.addClass('hidden');
      }
    });
  };

  projectView.setTeasers = function() {
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

  projectView.setTheme = function() {
    var darkTheme = $('<link rel="stylesheet" href="styles/themes/dark.css">');
    if (new Date().getHours() > 17) {
      $('head').append(darkTheme);
    }

    $('.icon-contrast').on('click', function() {
      let $foundDarkTheme = $('link[href="styles/themes/dark.css"]');
      if ($foundDarkTheme.length) {
        $foundDarkTheme.remove();
      } else {
        $('head').append(darkTheme);
      }
    })
  };

  projectView.populateFilter = function() {
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

  projectView.handleFilter = function() {
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

  projectView.addProjects = function() {
    app.Project.all.forEach(function(project){
      $('#projects').append(project.toHtml());
    });
  }

  projectView.handleMediaQueries = function() {
    let mediaQueryList = window.matchMedia('(min-width: 640px)')
    mediaQueryList.addListener(adjustForLargeScreens)
  };

  function adjustForLargeScreens(event) {
    if (event.matches) {
      $('.icon-menu').off('click', toggleMenu);
      $('.menu-item').off('click', toggleMenu);
    } else {
      $('.icon-menu').on('click', toggleMenu);
      $('.menu-item').on('click', toggleMenu);
    }
  }

  function toggleMenu() {
    $('main').toggle();
    $('.menu').slideToggle();
    $('.icon-menu').toggleClass('opened');
    $('header').toggleClass('stretched');
  }

  projectView.init = function() {
    projectView.setTheme();
    projectView.setTeasers();
    projectView.handleMainNav();
    projectView.addProjects();
    projectView.populateFilter();
    projectView.handleFilter();
    projectView.handleMediaQueries();
  };

  app.Project.fetchAll();
  module.projectView = projectView;
})(app);