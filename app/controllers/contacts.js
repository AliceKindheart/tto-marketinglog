'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * Find contact by id
 * Note: This is called every time that the parameter :id is used in a URL. 
 * Its purpose is to preload the company on the req object then call the next function. 
 */
exports.contact = function(req, res, next, id) {
    console.log('id => ' + id);
    console.log("CONTACTS.CONTACT");
    db.Contact.find({where: {id: id}}).then(function(contact){
        if(!contact) {
            return next(new Error('Failed to load contact ' + id));
        } else {
            req.contact = contact;
            console.log("CONTACT");
            //console.log(company);
            //return res.jsonp(company);
           return next();            
        }
    }).catch(function(err){
        return next(err);
    });
};

/**
 * Create a contact
 */
exports.create = function(req, res) {
    // augment the contact by adding the UserId
    req.body.UserId = req.user.id;
    console.log("req.body");
    console.log(req.body);
    // save and return an instance of contact on the res object. 
    db.Contact.create(req.body).then(function(contact){
        console.log("TRYING TO SAVE THE CONTACT INFO");
        //console.log(req.body);
        if(!contact){
            console.log("NOTACONTACT!!!!");
            return res.send('users/signup', {errors: new StandardError('Contact could not be created')});
        } else {
            return res.jsonp(contact);
            console.log("I THINK IT GOT SAVED");
            console.log(contact);
        }
    }).catch(function(err){
        console.log("THROWING AN ERROR MESSAGE");
        //return res.status(status).send(body, {
        return res.send('users/signup', { 
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a contact
 */
exports.update = function(req, res) {

    // create a new variable to hold the contact that was placed on the req object.
    var contact = req.contact;

    contact.updateAttributes({
        Contact_name: req.body.Contact_name,
        Notes: req.body.Notes
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
 * Delete a contact
 */
exports.destroy = function(req, res) {
    console.log("DESTROYDESTROYDESTROY");
    //console.log(req.company);
    // create a new variable to hold the company that was placed on the req object.
    var contact = req.contact;

    contact.destroy().then(function(){
        console.log("MADEITTHISFAR");
        return res.jsonp(contact);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**

 * Show a contact
 */
exports.show = function(req, res) {
    console.log("LOOKLOOKLOOK!!! SHOWSHOWSHOW!!!");
    // Sending down the contact that was just preloaded by the contacts.contact function
    // and saves contact on the req object.
    return res.jsonp(req.contact);
};
/**
 * List of Contacts
 */
exports.all = function(req, res) {
    console.log("exports.all for contacts happened");
    
    db.Contact.findAll().then(function(contacts){
        console.log("CCCCCContacts");
        return res.jsonp(contacts);
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
    if (req.contact.id !== req.contact.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
};


