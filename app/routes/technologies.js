'use strict';

/**
* Module dependencies.
*/
var technologies = require('../../app/controllers/technologies'),
users = require('../../app/controllers/users'),
companies = require('../../app/controllers/companies');

module.exports = function(app) {
// Tech Routes
app.route('/technologies')
    .get(technologies.all)
    .post(users.requiresLogin, technologies.create);
//app.route('/companies/create')
//	.get(companies.all);
app.route('/technologies/:technologyid')
    .get(technologies.show)
    .put(users.requiresLogin, technologies.update)
    .delete(users.requiresLogin, technologies.destroy);

app.route('/searchfortech')
	.get(technologies.search);


// Finish with setting up the id param
// Note: the techs.tech function will be called everytime then it will call the next function.
app.param('technologyid', technologies.technology);
};

