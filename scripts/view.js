'use strict';

var projectView = {};

projectView.handleMainNav = function() {
  $('.menu-item').on('click', function(){
    $('.tab-content').removeClass('slideLeft slideRight');
    $('.tab-content').removeAttr('style');

    var $previousTab = $('.selected');
    var $newTab = $(this);

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

      $newTabContent.animate({left: '0'});
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

projectView.init = function() {
  Project.all.forEach(function(project){
    $('#projects').append(project.toHtml());
  });

  projectView.setTeasers();
  projectView.handleMainNav();
};