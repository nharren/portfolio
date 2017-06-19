'use strict';

$(document).ready(function() {
  var mediaQueryList = window.matchMedia('(min-width: 640px)')
  mediaQueryList.addListener(handleEvents)
});

function handleEvents(event) {
  if (event.matches) {
    $('.icon-menu').off('click', toggleMenu);
    $('.menu-item').off('click', toggleMenu);
  } else {
    $('.icon-menu').on('click', toggleMenu);
    $('.menu-item').on('click', toggleMenu);
  }
}

function toggleMenu() {
  $('main').toggle();
  $('.menu').slideToggle();
  $('.icon-menu').toggleClass('opened');
  $('header').toggleClass('stretched');
}