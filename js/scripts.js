'use strict';

$(document).ready(function() {
  $('.icon-menu').mouseenter(openMenu);
  $('.menu-close-button').click(closeMenu);
});

function openMenu() {
  $('.menu').show();
}

function closeMenu() {
  $('.menu').hide();
}