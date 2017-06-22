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

projectView.populateSkillFilter = function() {
  var $skillFilter = $('.projects-skill-filter');
  var skills = [];
  Project.all.forEach(function(project) {
    skills = skills.concat(project.skills);
  });

  skills.forEach(function(skill) {
    $skillFilter.append($(`<option value="${skill}">${skill}</option>`));
  });
}

projectView.handleSkillFilter = function() {
  $('.projects-skill-filter').on('change', function() {
    var skill = $(this).val();
    if (skill) {
      $('.project').hide();
      $('.project').each(function() {
        $(this).find('.project-skill').get().forEach(s => {
          if (s.innerText.includes(skill)) {
            $(this).fadeIn();
          }
        });
      });
    } else {
      $('.project').fadeIn();
    }
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
  projectView.populateSkillFilter();
  projectView.handleSkillFilter();
};