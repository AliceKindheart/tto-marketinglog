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
app.route('/events/:techid')
    .get(events.show)
    .put(users.requiresLogin, events.update)
    .delete(users.requiresLogin, events.destroy);
app.route('/companiesforevent')
	.get(events.findcompanies);
app.route('/findcompanycontacts')
	.get(events.getcontacts);
app.route('/findtech')
	.get(events.findtech);
app.route('/getem')
	.get(events.getem);
app.route('/getusers')
	.get(events.getusers);
app.route('/getcontactsforevents')
	.get(events.getcontactsforevents);

// Finish with setting up the id param
// Note: the companies.company function will be called everytime then it will call the next function.
//app.param(':id', events.event);
};

