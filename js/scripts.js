'use strict';

$(document).ready(function() {
  $('.icon-menu').on('mouseenter', openMenu);
  $('.menu-close-button').on('click', closeMenu);
});

function openMenu() {
  $('.menu').show();
}

function closeMenu() {
  $('.menu').hide();
}