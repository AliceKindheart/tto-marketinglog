'use strict';

/**
* Module dependencies.
*/
var users = require('../../app/controllers/users'),
companies = require('../../app/controllers/companies'),
tags = require('../../app/controllers/tags');

module.exports = function(app) {
// Company Routes


app.route('/companies')
    .get(companies.all)
    .post(companies.create);

app.route('/companies/:companyid')
    .get(companies.show)
    .put(users.requiresLogin, companies.update)
    .delete(users.requiresLogin, companies.destroy);

//app.route('/tags')
//	.get(tags.listtags);


// Finish with setting up the id param
// Note: the companies.company function will be called everytime then it will call the next function.
app.param('companyid', companies.company);
};

