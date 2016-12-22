'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
//companies = require('../../app/controllers/companies'),
tags = require('../../app/controllers/tags');

module.exports = function(app) {
// Tag Routes



	app.route('/tags')
		.get(tags.listtags)
		//.post(users.requiresLogin, companies.create);

};