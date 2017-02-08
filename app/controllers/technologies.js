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
    
    db.Technology.findAll({include: [{model: db.Tag}, {model: db.User}]}).then(function(technologies){
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
    db.Technology.find({where: {id: id}, include: [{model: db.Tag}, {model: db.User}]}).then(function(technology){
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
    //req.body.UserId = req.user.id;
    console.log("req.body");
    console.log(req.body);
    var tagrows;
    var thetechnology;
    var marketer = req.body.Tech_marketer;
    var personn;
    // save and return an instance of company on the res object. 

    db.User.find({where:{name: marketer}})
        .then(function(person){
            personn = person;
            //console.log("PERSSSSSSSSSSSSSSSON", person);
        }).then(function(){
            if (req.body.Tag_name){
                var Tagnames = req.body.Tag_name;
                db.Tag.findAll({where:{Tag_name:{$in:Tagnames}}})
                    .then(function(rowoftags){
                        tagrows=rowoftags;
                        return db.Technology.create(req.body);
                    }).then(function(technology){
                        thetechnology = technology;
                        technology.setUser(personn);
                        console.log("PERSSSSSSSSSSSSSSSON", personn);
                        return technology.addTags(tagrows);                
                    }).then(function(){
                        if(!thetechnology){
                            console.log("NOTATECHNOLOGY!!!");
                            return res.send('users/signup', {errors: new StandardError("Technology could not be created")});
                         } else {
                            return res.jsonp(thetechnology);
                         }
                    }).catch(function(err){
                        console.log("THROWING AN ERROR MESSAGE", err);
                        return res.send('users/signup', {
                            errors: err,
                            status: 500
                        });
                    });
            } else {
                db.Technology.create(req.body).then(function(technology){
                    if(!technology){
                            console.log("NOTATECHNOLOGY!!!");
                            return res.send('users/signup', {errors: new StandardError("Technology could not be created")});
                         } else {
                            technology.setUser(personn);
                            return res.jsonp(technology);
                         }
                    }).catch(function(err){
                        console.log("THROWING AN ERROR MESSAGE", err);
                        return res.send('users/signup', {
                            errors: err,
                            status: 500
                        });
                    });
            }
        });
};

/**
 * Update a technology
 */
exports.update = function(req, res) {

    // create a new variable to hold the technology that was placed on the req object.
    var technology = req.technology;
    var newtags = req.body.Tag_name.join(", ").split(", ");
    var tagrows;
    var techid = req.body.id;
    console.log("REQQQQQQQQQQQQQQ.BODDDDDY", req.body);
    var newuser;

    if(newtags){
        return db.User.findOne({where: {name: req.body.Tech_marketer}})
            .then(function(user){
                newuser = user;
                console.log("NEWWWWWWWWWUSSSSSSSERRRR", newuser);
                //find tags to add in the dB
                db.Tag.findAll({where: {Tag_name: {$in:newtags}}
                    }).then(function(rowoftags){
                        //create a reference to the set of tags to be added that's outside this function
                        tagrows=rowoftags;

                        //find technology to be updated
                        return db.Technology.findOne({where: {id: techid}, include: [{model: db.Tag}]
                    }).then(function(technogoly){
                        //add the new tags
                        return technology.addTags(tagrows);
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
                        console.log("ERRRRRRORRRR", err);
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
                console.log("NEWWWWWWWWWUSSSSSSSERRRR", newuser);
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
}


//    technology.updateAttributes({
  //      Tech_RUNumber: req.body.Tech_RUNumber,
    //    Tech_name: req.body.Tech_name,
      //  Tech_inventor: req.body.Tech_inventor
//    }).then(function(a){
  //      technology.addTag([req.body.Tag_name]);
    //    return res.jsonp(a);
//    }).catch(function(err){
  //      return res.render('error', {
    //        error: err, 
      //      status: 500
//        });
  //  });
//};

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


