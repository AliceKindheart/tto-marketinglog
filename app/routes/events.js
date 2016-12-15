'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
events = require('../../app/controllers/events');

module.exports = function(app) {
// Company Routes
app.route('/events')
    .get(events.all)
    .post(users.requiresLogin, events.create);
//app.route('/companies/create')
//	.get(companies.all);
app.route('/events/:eventid')
    .get(events.show)
    .put(users.requiresLogin, events.update)
    .delete(users.requiresLogin, events.destroy);


// Finish with setting up the id param
// Note: the companies.company function will be called everytime then it will call the next function.
//app.param(':id', events.event);
};

