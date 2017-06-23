'use strict';

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
  Project.all.forEach(function(project) {
    project.technologies.forEach(function(technology) {
      technologies.push(technology);
    });
  });

  technologies.sort();
  technologies = new Set(technologies);

  technologies.forEach(function(technology) {
    $filter.append($(`<div class="filter-item">${technology}</div>`));
  });
}

projectView.handleFilter = function() {
  $('.filter-selection').on('click', function() {
    $('.filter-dropdown').slideToggle(200);
  });

  $('.filter-item').on('mousedown', function(){
    $('.filter-dropdown').toggle();
    var technology = $(this).get(0).innerText;
    if (!technology.startsWith('--')) {
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
  Project.all.forEach(function(project){
    $('#projects').append(project.toHtml());
  });
}

projectView.init = function() {
  projectView.setTheme();
  projectView.setTeasers();
  projectView.handleMainNav();
  projectView.addProjects();
  projectView.populateFilter();
  projectView.handleFilter();
};