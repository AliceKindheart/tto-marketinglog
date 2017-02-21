'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
tags = require('../../app/controllers/tags');

module.exports = function(app) {
// Tag Routes

	app.route('/tags')
		.get(tags.listtags)
		.delete(tags.deletetag)
		.post(tags.addtag);
};