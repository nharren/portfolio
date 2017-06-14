'use strict';

// function codeSample(title, image, description) {
//   this.title = title;
//   this.image = image;
//   this.description = description;
// }
//
// function project(title, image, link, description) {
//   this.title = title;
//   this.image = image;
//   this.link = link;
//   this.description = description;
// }

$(document).ready(function() {
  $('.icon-menu').mouseenter(openMenu);
  $('.menu-close-button').click(closeMenu);
});

function openMenu() {
  $('.menu').show();
}

function closeMenu() {
  $('.menu').css('display', '');
}
