'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * List of Events
 */
exports.all = function(req, res) {
    console.log("exports.all events happened");
    
    db.Event.findAll().then(function(events){
        console.log("EVVVVVVENNNNTTTSSS");
        return res.jsonp(events);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Find event by id
 * Note: This is called every time that the parameter :id is used in a URL. 
 * Its purpose is to preload the company on the req object then call the next function. 
 */
exports.event = function(req, res, next, id) {
    console.log('eventid => ' + id);
    console.log("EVENTS.EVENT");
    db.Event.find({where: {id: id}}).then(function(event){
        //console.log(id);
        if(!event) {
            console.log("not an event");
            //return next(new Error('Failed to load company ' + id));
            return next();
        } else {
            req.event = event;
            console.log("EVENT");
            console.log(event);
            //return res.jsonp(company);
           return next();            
        }
    }).catch(function(err){
        return next(err);
    });
};



/* Show an event
 */
exports.show = function(req, res) {
    console.log("EVENTS.SHOW");
    console.log("LOOKEVENT!! SHOW!!!");
        // Sending down the event that was just preloaded by the events.event function
    // and saves event on the req object.
    return res.jsonp(req.event);
};
/**
 * Create an event
 */
exports.create = function(req, res) {
    console.log("CCCCCCCCCCRRRRRRRRRRRRREEEEEEEEEEEAATE");
    // augment the event by adding the UserId
    req.body.UserId = req.user.id;
    console.log("req.body");
    console.log(req.body);
    // save and return an instance of event on the res object. 
    db.Event.create(req.body).then(function(event){
        //event.addCompany([req.body.Company_name]);
        console.log("TRYING TO SAVE THE EVENT INFO");
        //console.log(req.body);
        if(!event){
            console.log("NOTANEVENT!!!!");
            return res.send('users/signup', {errors: new StandardError('EVENT could not be created')});
        } else {
            return res.jsonp(event);
        }
    }).catch(function(err){
        console.log("THROWING AN ERROR MESSAGE", err);
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Update an event
 */
exports.update = function(req, res) {

    // create a new variable to hold the company that was placed on the req object.
    var event = req.event;
    event.addCompany(req.body.Company_name, {through: 'CompanyEvents'});
    event.addTech(req.body.Tech_name, {through: 'TechEvents'});
    event.AddContact(req.body.Contact_name, {through: 'ContactEvents'});

    event.updateAttributes({
        Event_date: req.body.Event_date,
        Event_notes: req.body.Event_notes
    }).then(function(a){
        event.addCompany([req.body.Company_name]);
        event.addTech([req.body.TechEvents]);
        event.addContact(req.body.Contact_name);
        return res.jsonp(a);
    }).catch(function(err){
        return res.render('error', {
            error: err, 
            status: 500
        });
    });
};

/**
 * Delete an event
 */
exports.destroy = function(req, res) {
    console.log("DESTROYEVENT");
    // create a new variable to hold the event that was placed on the req object.
    var event = req.event;

    event.destroy().then(function(){
        console.log("MADEITTHISFAR");
        return res.jsonp(event);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};


exports.findcompanies = function(req,res){
    console.log("FINDDDCOMPPPSSS");
    db.Company.findAll({include: {model: db.Contact}})
        .then(function(comps){
            //console.log("COMMPS", comps);
            return res.jsonp(comps);
        });
};

exports.findtech = function(req,res){
    //console.log("FINDDDTECCCCC");
    db.Technology.findOne({where: {id: req.query.id}})
        .then(function(tec){
            return res.jsonp(tec);
        });
};

exports.getcontacts = function(req,res){
    //console.log("GETTTTCONTACTSSSS", req.query);
    db.Company.findOne({where: {Company_name: req.query.Company_name}, include: {model: db.Contact}})
        .then(function(company){
            return res.jsonp(company);
            
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


