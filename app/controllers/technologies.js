'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * List of Technologies
 */
exports.all = function(req, res) {
    console.log("exports.alltechs happened");
    
    db.Technology.findAll().then(function(technologies){
        console.log("TECHS!!!!!!!!!!!!");
        return res.jsonp(technologies);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Find technology by id
 * Note: This is called every time that the parameter :id is used in a URL. 
 * Its purpose is to preload the company on the req object then call the next function. 
 */
exports.technology = function(req, res, next, id) {
    console.log('techid => ' + id);
    console.log("TECHNOLOGIES.TECH");
    db.Technology.find({where: {id: id}}).then(function(technology){
        //console.log(id);
        if(!technology) {
            //return next(new Error('Failed to load company ' + id));
            return next();
        } else {
            req.technology = technology;
            console.log("TECHNOLOGY");
            console.log(technology);
            //return res.jsonp(company);
           return next();            
        }
    }).catch(function(err){
        return next(err);
    });
};


/* Show a technology
 */
exports.show = function(req, res) {
    console.log("TECHNOLOGIES.SHOW");
    console.log("LOOKTECHNOLOGY!!");
    // Sending down the technology that was just preloaded by the technologies.technology function
    // and saves tech on the req object.
    return res.jsonp(req.technology);
};
/**
 * Create a technology
 */
exports.create = function(req, res) {
    // augment the company by adding the UserId
    req.body.UserId = req.user.id;
    console.log("req.body");
    console.log(req.body);
    // save and return an instance of company on the res object. 
    db.Technology.create(req.body).then(function(technology){
        //technology.addTags([req.body.company.Tag_name]);
        console.log("TRYING TO SAVE THE TECHNOLOGY INFO");
        //console.log(req.body);
        if(!technology){
            console.log("NOTATECHNOLOGY!!!!");
            return res.send('users/signup', {errors: new StandardError('Technology could not be created')});
        } else {
            return res.jsonp(technology);
           // console.log("I THINK THE TECH GOT SAVED");
            //console.log(tech);
        }
    }).catch(function(err){
        console.log("THROWING AN ERROR MESSAGE");
        return res.body(body, {
        //return res.status(status).send(body, {
        //return res.send('users/signup', { 
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a technology
 */
exports.update = function(req, res) {

    // create a new variable to hold the technology that was placed on the req object.
    var technology = req.technology;
    technology.addTags(technology.Tag_name, {through: 'TechTags'});
    

    technology.updateAttributes({
        Tech_RUNumber: req.body.Tech_RUNumber,
        Tech_name: req.body.Tech_name,
        Tech_inventor: req.body.Tech_inventor
    }).then(function(a){
        technology.addTag([req.body.Tag_name]);
        return res.jsonp(a);
    }).catch(function(err){
        return res.render('error', {
            error: err, 
            status: 500
        });
    });
};

/**
 * Delete a technology
 */
exports.destroy = function(req, res) {
    console.log("DESTROYTECHNOLOGY");
    // create a new variable to hold the technology that was placed on the req object.
    var technology = req.technology;

    technology.destroy().then(function(){
        console.log("SOFARSOGOOD");
        return res.jsonp(technology);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**



/**
 * Article authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.company.id !== req.company.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
};


