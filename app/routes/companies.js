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
    .post(companies.create);
app.route('/companies/:id')
    .get(companies.show)
    .put(users.requiresLogin, companies.hasAuthorization, companies.update)
    .delete(users.requiresLogin, companies.hasAuthorization, companies.destroy);

// Finish with setting up the id param
// Note: the companies.company function will be called everytime then it will call the next function.
app.param('id', companies.show);
};

