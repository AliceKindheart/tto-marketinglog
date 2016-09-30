'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * Find company by id
 * Note: This is called every time that the parameter :companyId is used in a URL. 
 * Its purpose is to preload the company on the req object then call the next function. 
 */
exports.company = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Company.find({where: {id: id}, include: [{model:db.Company, attributes:['id', 'companyname', 'notes']}]}).then(function(company){
        if(!company) {
            return next(new Error('Failed to load company ' + id));
        } else {
            req.company = company;
            return next();            
        }
    }).catch(function(err){
        return next(err);
    });
};

/**
 * Create a company
 */
exports.create = function(req, res) {
    // augment the company by adding the UserId
    req.body.UserId = req.user.id;
    // save and return and instance of company on the res object. 
    db.Company.create(req.body).then(function(company){
        if(!company){
            return res.send('users/signup', {errors: new StandardError('Company could not be created')});
        } else {
            return res.jsonp(company);
        }
    }).catch(function(err){
        return res.send('users/signup', { 
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a company
 */
exports.update = function(req, res) {

    // create a new variable to hold the copmany that was placed on the req object.
    var company = req.company;

    company.updateAttributes({
        companyname: req.body.companyname,
        notes: req.body.notes
    }).then(function(a){
        return res.jsonp(a);
    }).catch(function(err){
        return res.render('error', {
            error: err, 
            status: 500
        });
    });
};

/**
 * Delete a company
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the company that was placed on the req object.
    var company = req.company;

    company.destroy().then(function(){
        return res.jsonp(company);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show a company
 */
exports.show = function(req, res) {
    // Sending down the company that was just preloaded by the companies.company function
    // and saves company on the req object.
    return res.jsonp(req.company);
};

/**
 * List of Companies
 */
exports.all = function(req, res) {
    console.log("exports.all happened");
    
    db.Company.findAll().then(function(companies){
        console.log("MMMMMMMMMMMMMMMMMMMMMM");
        return res.jsonp(companies);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Article authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.company.id !== req.company.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
};

exports.company_id = function(req, res, next, id) {
    db.Company.find({where : { id: id }}).then(function(company){
      if (!company) {
          return next(new Error('Failed to load Company ' + id));
      }
      req.profile = company;
      next();
    }).catch(function(err){
      next(err);
    });
};
