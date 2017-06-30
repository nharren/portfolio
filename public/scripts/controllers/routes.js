'use strict';

var app = app || {};

page('/', app.projectsController.loadAll, app.projectsController.showPage);
page('/snake', app.snakeController.showPage);
page('/about', app.aboutController.showPage);

page();