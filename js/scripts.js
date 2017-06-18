'use strict';

$(document).ready(function() {
  $('.icon-menu').on('click', toggleMenu);
  $('.menu-item').on('click', toggleMenu);
});

function toggleMenu() {
  $('main').toggle();
  $('.menu').slideToggle();
  $('.icon-menu').toggleClass('opened');
  $('header').toggleClass('stretched');
}