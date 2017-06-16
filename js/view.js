'use strict';

var projectView = {};

projectView.handleMainNav = function() {
  $('.menu-item').on('click', function(){
    $('.tab-content').hide();
    $('#' + $(this).attr('data-content')).show();
    if ($('.icon-menu').css('display') !== 'none') {
      $('.menu').hide();
    }
  });
};

projectView.setTeasers = function() {
  $('.project-details').hide();

  $('.projects-container').on('click','.project-read-more', function(event) {
    var $readOn = $(this);
    $readOn.prev('.project-details').slideToggle();

    if ($readOn.text().startsWith('Read M')) {
      $readOn.text('Read Less');
    } else {
      $readOn.text('Read More');
    }

    event.preventDefault();
  });
};

$(document).ready(function() {
  projectView.setTeasers();
  projectView.handleMainNav();
});