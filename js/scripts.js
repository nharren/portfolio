'use strict';

$(document).ready(function() {
  $('.icon-menu').on('mouseenter', openMenu);
  $('.menu-close-button').on('click', closeMenu);
  $('.menu-item').on('click', closeMenu);
});

function openMenu() {
  $('.menu').show();
}

function closeMenu() {
  if (window.innerWidth <= 640) {
    $('.menu').hide();
  }
}