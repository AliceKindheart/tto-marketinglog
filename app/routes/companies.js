'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
companies = require('../../app/controllers/companies');

module.exports = function(app) {
// Company Routes
app.route('/companies')
    .get(companies.all)
    .post(users.requiresLogin, companies.create);

app.route('/companies/:companyid')
    .get(companies.show)
    .put(users.requiresLogin, companies.update)
    .delete(users.requiresLogin, companies.destroy);

app.route('companies/create')
	.get(companies.listtags);


// Finish with setting up the id param
// Note: the companies.company function will be called everytime then it will call the next function.
app.param('companyid', companies.company);
};

