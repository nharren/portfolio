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

    var left;

    if ($newTab.index() > $previousTab.index()) {
      $newTabContent.addClass('slideLeft');
      left = '-200%';
    } else {
      $newTabContent.addClass('slideRight');
      left = '200%';
    }

    $previousTabContent.animate({left: left}, {
      queue: false, 
      complete: function() {
        $previousTabContent.addClass('hidden');
      }
    });

    $newTabContent.animate({left: '0'});
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

$(document).ready(function() {
  projectView.setTeasers();
  projectView.handleMainNav();
});