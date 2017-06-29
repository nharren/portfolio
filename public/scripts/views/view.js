'use strict';

var app = app || {};

(function(module) {
  var view = {};

  view.initialized = false;

  view.showPage = function(section) {
    let newTab = $(`.menu-item[data-content="${section}"]`);
    var previousTab = $('.selected');

    if (newTab.hasClass('selected')) {
      return;
    }

    $('.tab-content').removeAttr('style');

    var previousTabContent = $('#' + previousTab.data('content'));
    var newTabContent = $('#' + section)

    previousTab.removeClass('selected');
    newTab.addClass('selected');

    newTabContent.removeClass('hidden');

    if (window.innerWidth > 640) {
      var left;

      if (newTab.index() > previousTab.index()) {
        newTabContent.addClass('slideLeft');
        left = '-100vw';
      } else {
        newTabContent.addClass('slideRight');
        left = '100vw';
      }

      previousTabContent.animate({left: left}, '1s', function() {
        previousTabContent.addClass('hidden');
      });

      newTabContent.animate({left: '0'}, function(){
        newTabContent.removeClass('slideLeft slideRight');
      });
    } else {
      previousTabContent.addClass('hidden');
    }
  }

  view.setTheme = function() {
    var lightTheme = $('<link rel="stylesheet" href="styles/themes/light.css">');
    var darkTheme = $('<link rel="stylesheet" href="styles/themes/dark.css">');

    let currentHour = new Date().getHours();
    let theme = currentHour > 7 && currentHour < 17 ? lightTheme : darkTheme;

    $('head').append(theme);

    $('.icon-contrast').on('click', function() {
      let foundTheme = $('link[href^="styles/themes/"]');

      if (foundTheme.attr('href').endsWith('dark.css')) {
        foundTheme.attr('href', 'styles/themes/light.css');
      } else {
        foundTheme.attr('href', 'styles/themes/dark.css');
      }
    })
  };

  view.handleMediaQueries = function() {
    let mediaQueryList = window.matchMedia('(min-width: 640px)');
    mediaQueryList.addListener(adjustForLargeScreens);
  };

  function adjustForLargeScreens(event) {
    event.matches ? unhandleToggleMenu() : handleToggleMenu();
  }

  function handleToggleMenu() {
    $('.icon-menu').on('click', toggleMenu);
    $('.menu-item').on('click', toggleMenu);
  }

  function unhandleToggleMenu() {
    $('.icon-menu').off('click', toggleMenu);
    $('.menu-item').off('click', toggleMenu);
  }

  function toggleMenu() {
    $('main').toggle();
    $('.menu').slideToggle();
    $('.icon-menu').toggleClass('opened');
    $('header').toggleClass('stretched');
  }

  view.init = function() {
    if (view.initialized) {
      return;
    }

    if (window.innerWidth < 640) {
      handleToggleMenu();
    }

    view.setTheme();
    view.handleMediaQueries();
    view.initialized = true;
  };

  module.view = view;
})(app);