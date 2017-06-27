'use strict';

var app = app || {};

page('/', app.projectsController.showPage);
page('/about', app.aboutController.showPage);

page();