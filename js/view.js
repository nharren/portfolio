'use strict';

var projectView = {};

projectView.handleMainNav = function() {
  $('.menu-item').on('click', function(){

    $('.selected-tab').removeClass('selected-tab');
    $('.tab-content:not(.hidden)').addClass('hidden');

    $(this).addClass('selected-tab');
    $('#' + $(this).data('content')).removeClass('hidden');
  });
};

projectView.setTeasers = function() {
  $('.project-details').hide();

  $('#projects').on('click','.project-header', function(event) {
    var $projectHeader = $(this);
    $projectHeader.siblings('.project-details').slideToggle();
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