'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
contacts = require('../../app/controllers/contacts');

module.exports = function(app) {
// Company Routes
app.route('/contacts')
    .get(contacts.all)
    .post(users.requiresLogin, contacts.create);
app.route('/contacts/:contactid')
    .get(contacts.showy)
    .put(users.requiresLogin, contacts.update)
    .delete(users.requiresLogin, contacts.destroy);

app.route('/searchforcontacts')
	.get(contacts.search);

// Finish with setting up the id param
// Note: the conctacts.contact function will be called everytime then it will call the next function.
app.param('contactid', contacts.contact);
};

