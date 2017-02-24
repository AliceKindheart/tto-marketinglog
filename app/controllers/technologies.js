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
    db.Technology.findAll({include: [{model: db.Tag}, {model: db.User}]})
        .then(function(technologies){
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
    db.Technology.find({where: {id: id}, include: [{model: db.Tag}, {model: db.User}]})
        .then(function(technology){
            if(!technology) {
                return next();
            } else {
                req.technology = technology;
               return next();            
            }
        }).catch(function(err){
            return next(err);
        });
};


/* Show a technology
 */
exports.show = function(req, res) {
    return res.jsonp(req.technology);
};
/**
 * Create a technology
 */
exports.create = function(req, res) {
    var tagrows;
    var thetechnology;
    var marketer = req.body.Tech_marketer;
    var personn;
    // save and return an instance of company on the res object. 

    db.User.find({where:{name: marketer}})
        .then(function(person){
            //saving the marketer to an outside variable for future reference
            personn = person;
        }).then(function(){
            if (req.body.Tag_name){
                var Tagnames = req.body.Tag_name;
                db.Tag.findAll({where:{Tag_name:{$in:Tagnames}}})
                    .then(function(rowoftags){
                        //saving the found tags to an outside variable for future reference
                        tagrows=rowoftags;
                        return db.Technology.create(req.body);
                    }).then(function(technology){
                        thetechnology = technology;
                        technology.setUser(personn);
                        return technology.addTags(tagrows);                
                    }).then(function(){
                        if(!thetechnology){
                            return res.send('users/signup', {errors: new StandardError("Technology could not be created")});
                         } else {
                            return res.jsonp(thetechnology);
                         }
                    }).catch(function(err){
                        return res.send('users/signup', {
                            errors: err,
                            status: 500
                        });
                    });
            } else {
                db.Technology.create(req.body).then(function(technology){
                    if(!technology){
                            return res.send('users/signup', {errors: new StandardError("Technology could not be created")});
                         } else {
                            technology.setUser(personn);
                            return res.jsonp(technology);
                         }
                    }).catch(function(err){
                        return res.send('users/signup', {
                            errors: err,
                            status: 500
                        });
                    });
            }
        });
};

exports.search = function(req, res){
    console.log("SEARCHING");
    console.log(req.query.number);
    db.Technology.findOne({where: {Tech_RUNumber: req.query.number}, include: [{model: db.Tag}, {model: db.User}]})
        .then(function(tech){
            console.log("tech:", tech);
            return res.jsonp(tech);
        }).catch(function(err){
            return res.send({
                errors: err,
                status: 500
            });
        });
};

exports.searchformine = function(req,res){
    console.log("req.user:", req.user);
    db.Technology.findAll({where: {UserId: req.user.id, isActive: true}, include: [{model: db.User}, {model: db.Tag}]})
        .then(function(tex){
            console.log("TEXXXXXXXXX", tex);
            return res.jsonp(tex);
        }).catch(function(err){
            return res.send({
                errors: err,
                status: 500
            });
        });
};

exports.active = function(req,res){
    console.log("HHHHHHHHHHHHHHIIIII");
    db.Technology.findAll({where: {isActive: true}, include: [{model: db.User}, {model: db.Tag}]})
        .then(function(tex){
            console.log("TEXXXXX", tex);
            return res.jsonp(tex);
        }).catch(function(err){
            return res.send({
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
    //console.log("req.body.marketer", req.body.marketer);
    var technology = req.technology;
    var newtags = req.body.Tag_name.join(", ").split(", ");
    console.log("new tags", newtags);
    var tagrows;
    var techid = req.body.id;
    var newuser;

    if(newtags){
        console.log("There are new tags");
        return db.User.findOne({where: {name: req.body.marketer}})
            .then(function(user){
                newuser = user;
                //find tags to add in the dB
                db.Tag.findAll({where: {Tag_name: {$in:newtags}}
                    }).then(function(rowoftags){
                        //create a reference to the set of tags to be added that's outside this function
                        tagrows=rowoftags;
                        console.log("TAGROWS", tagrows);
                        //find technology to be updated
                        return db.Technology.findOne({where: {id: techid}, include: [{model: db.Tag}]
                    }).then(function(technogoly){
                        //add the new tags
                        return technology.setTags(tagrows);
                    }).then(function(tech){
                        //update the technology
                        return technology.updateAttributes({
                            Tech_RUNumber: req.body.Tech_RUNumber,
                            Tech_name: req.body.Tech_name,
                            Tech_inventor: req.body.Tech_inventor
                    }).then(function(tek){
                        //set user
                        tek.setUser(newuser);
                        return res.jsonp(tek);        
                    }).catch(function(err){
                        return res.render('error',{
                            error: err,
                            status: 500
                        });
                    });
                });
            });
            });
    } else {
        return db.User.findOne({where: {name: req.body.Tech_marketer}})
            .then(function(user){
                newuser = user;
                technology.updateAttributes({
                    Tech_RUNumber: req.body.Tech_RUNumber,
                    Tech_name: req.body.Tech_name,
                    Tech_inventor: req.body.Tech_inventor   
                }).then(function(a){
                    a.setUser(req.body.Tech_marketer);
                    return res.jsonp(a);
                }).catch(function(err){
                    return res.render('error', {
                        error: err,
                        status: 500
                    });
                });
            });
    }
};

/**
 * Delete a technology
 */
exports.destroy = function(req, res) {
    // create a new variable to hold the technology that was placed on the req object.
    var technology = req.technology;

    technology.destroy().then(function(){
        return res.jsonp(technology);
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


