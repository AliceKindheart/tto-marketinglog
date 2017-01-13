'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');

/**
 * Find contact by id
 * Note: This is called every time that the parameter :id is used in a URL. 
 * Its purpose is to preload the contact on the req object then call the next function. 
 */
exports.contact = function(req, res, next, id) {
    console.log('contactid => ' + id);
    console.log("CONTACTS.CONTACT");
    db.Contact.find({where: {id: id}, include: [{model: db.Company}]}).then(function(contact){
        if(!contact) {
            //return next(new Error('Failed to load contact ' + id));
            return next();
        } else {
            req.contact = contact;
            console.log("CONTACT");
            //console.log(company);
            //return res.jsonp(contact);
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
    req.body.UserId = req.user.id;
    console.log("req.body");
    console.log(req.body);
    var companyid;
    var foundcompany;
    var contact; 

    // save and return an instance of contact on the res object. 
    db.Company.findOne({where:{Company_name: req.body.Company_name}})
        .then(function(company){
            console.log("COMPANYFOUND", "COMPANYID", company.id);
            console.log("COMPANNNNNNNNNNNNNNNNNNNY", company)
            foundcompany = company;
            companyid = company.id ;
            //company.setAssociations
            return db.Contact.create(req.body);
        }).then(function(contact){
            //contact.addCompanies(foundcompany);
            console.log("UPDATEDCONTACT", contact);
            contact.setCompany(foundcompany);
            //return contact.updateAttributes({
              //  CompanyId: companyid
            //});
            //contact.belongsTo(foundcompany);
            //foundcompany.addContact(contact);
            return contact;
        }).then(function(contact){
            console.log("CONTACTBEINGRETURNED", contact);
            return res.jsonp(contact);
        }).catch(function(err){
            console.log("THROWING AN ERROR MESSAGE", err);
            return res.status(status).send('users/signup', {
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
    //var Company_name = req.body.Company_name
    console.log(req.body.compname);
    console.log("REQQQQQQQQQQQQ>BODY", req.body);
    var idforcompany;

    db.Company.findOne({where:{Company_name: req.body.compname}})
        .then(function(company){
            //console.log(company, "COMPPPPPPPPPPPPPPANY");
            idforcompany=company.id;

            return contact.updateAttributes({
                CompanyId: idforcompany,
                Contact_name: req.body.Contact_name,
                Contact_title: req.body.Contact_title,
                Contact_email: req.body.Contact_email,
                Contact_phone: req.body.Contact_phone,
                Notes: req.body.Notes
            })
        }).then(function(a){
            console.log("AAAAAAAAAAAAAAAAAAAA", a);
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
exports.showy = function(req, res) {
    console.log("LOOKLOOKLOOK!!! SHOWySHOWySHOWy!!!");
    // Sending down the contact that was just preloaded by the contacts.contact function
    // and saves contact on the req object.
    return res.jsonp(req.contact);
};
/**
 * List of Contacts
 */
exports.all = function(req, res) {
    console.log("exports.all for contacts happened");
    
    db.Contact.findAll({include: [{model: db.Company}]}).then(function(contacts){
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


