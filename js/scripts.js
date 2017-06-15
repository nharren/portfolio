'use strict';

$(document).ready(function() {
  $('.icon-menu').mouseenter(openMenu);
  $('.menu-close-button').click(closeMenu);
  $('.project-toggle-details-button').on('click',revealProjectDetails)
});

function openMenu() {
  $('.menu').show();
}

function closeMenu() {
  $('.menu').css('display', '');
}

function revealProjectDetails() {
  $('.project-details').slideToggle();
}