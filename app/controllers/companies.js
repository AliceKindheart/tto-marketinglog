'use strict';

/**
 * Module dependencies.
 */
var StandardError = require('standard-error');
var db = require('../../config/sequelize');


/**
 * Find company by id
 * Note: This is called every time that the parameter :id is used in a URL. 
 * Its purpose is to preload the company on the req object then call the next function. 
 */
exports.company = function(req, res, next, id) {
    console.log('id => ' + id);
    console.log("COMPANIES.COMPANy");
    db.Company.find({where: {id: id}, include: [{model: db.Tag}, {model: db.Contact}]}).then(function(company){
        //, where: {CompanyId: id}
        //console.log(id);
        if(!company) {
            //return next(new Error('Failed to load company ' + id));
            return next();
        } else {
            
            req.company = company; // {Company_name: "Whatever", Notes: "Stuff", tags: [{Tag_name: "Foo"}]}
            console.log("COMPANY");
            console.log(company);
            //return res.jsonp(company);

           return next();            
        }
    }).catch(function(err){
        return next(err);
    });
};

/**
 * List of Companies
 */
exports.all = function(req, res) {
    console.log("exports.all happened");
    
    db.Company.findAll({include: [{model: db.Tag}]}).then(function(companies){
        console.log("MMMMMMMMMMMMMMMMMMMMMM");
        return res.jsonp(companies);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/* Show a company
 */
exports.show = function(req, res) {
    console.log("COMPANIES.SHOW");
    console.log("LOOKLOOKLOOK!!! SHOWSHOWSHOW!!!");
    console.log(req.company);
        // Sending down the company that was just preloaded by the companies.company function
    // and saves company on the req object.
    return res.jsonp(req.company);
};
/**
 * Create a company
 */
exports.create = function(req, res) {
    // augment the company by adding the UserId
    req.body.UserId = req.user.id;
    console.log("req.body");
    console.log(req.body);
    var tagrows;
    var thecompany;
    
    if (req.body.Tag_name){
        var Tagnames = req.body.Tag_name;

        db.Tag.findAll({where:{Tag_name:{$in:Tagnames}}})
            .then(function(rowoftags){
                tagrows=rowoftags;
                return db.Company.create(req.body);
            })
        // save and return an instance of company on the res object. 
        .then(function(company){
            //add tags to the company
            console.log("TRYING TO SAVE THE COMPANY INFO");
            thecompany= company;
            return company.addTags(tagrows);
        }).then(function(){
            //console.log(req.body);
            if(!thecompany){
                console.log("NOTACOMPANY!!!!");
                return res.send('users/signup', {errors: new StandardError('Company could not be created')});
            } else {
                return res.jsonp(thecompany);
               // console.log("I THINK IT GOT SAVED");
                //console.log(company);
            }
        }).catch(function(err){
            console.log("THROWING AN ERROR MESSAGE", err);
            //return res.status(status).send(body, {
            return res.send('users/signup', { 
                errors: err,
                status: 500
            });
        });
    } else {
        db.Company.create(req.body).then(function(company){
        //company.addTag(company.Tag_name);
        console.log("TRYING TO SAVE THE COMPANY INFO");
        //console.log(req.body);
        if(!company){
            console.log("NOTACOMPANY!!!!");
            return res.send('users/signup', {errors: new StandardError('Company could not be created')});
        } else {
            return res.jsonp(company);
         }   
        }).catch(function(err){
            console.log("THROWING AN ERROR MESSAGE");
            //return res.status(status).send(body, {
            return res.send('users/signup', { 
                errors: err,
                status: 500
            });
        });
    }
};

exports.addtag = function(req, res) {
    console.log("req.body");
    console.log(req.body);
    var id = req.body.id;
    var tagrows;
    var Tagnames = req.body.tag.Tag_name.split(", ");
    db.Tag.findAll({where:{Tag_name:{$in:Tagnames}}})
        .then(function(rowoftags){
            tagrows=rowoftags;
            return db.Company.find({where: {id: id}, include: [{model: db.Tag}]}).then(function(company){
                return company.addTags(tagrows);
            }).then(function(comp){
                return res.jsonp(comp);
            });
        });
};


/**
 * Update a company
 */
exports.update = function(req, res) {

    // create a new variable to hold the company that was placed on the req object.
    var company = req.company;
    console.log("req.body", req.body);
    console.log("COMPANY", company);
   // var newtags = req.body.Tag_name;
    var newtags = req.body.Tag_name.join(", ").split(", ");
    console.log("NEWTAGS", newtags);

    var tagrows;
    var companyid = req.body.id;
     
    
    if (newtags){
        db.Tag.findAll({where:{Tag_name: {$in:newtags}}})
            .then(function(rowoftags){
                tagrows=rowoftags;
                console.log("TAGROWS", tagrows);
               
                return db.Company.findOne({where: {id: companyid}, include: [{model: db.Tag}]}).then(function(company){
                    console.log("HELLOTHECOMPANY", company);
                    return company.setTags(tagrows);
                }).then(function(comp){
                    console.log("COMP", comp);
                    return comp.updateAttributes({
                        Company_name: req.body.Company_name,
                        Notes: req.body.Notes,
                        //Tags: tagrows
                    });
                }).then(function(company){
                    return res.jsonp(company);
                }).catch(function(err){
                    console.log("ERRRRRRORRRR", err);
                    return res.render('error',{
                        error: err,
                        status: 500
                    });
                });
            });
    } 
    else {
            company.updateAttributes({
                Company_name: req.body.Company_name,
               Notes: req.body.Notes
        }).then(function(a){
            return res.jsonp(a);
        }).catch(function(err){
            return res.render('error', {
                error: err, 
                status: 500
            });
        });
    }
};


/**
 * Delete a company
 */
exports.destroy = function(req, res) {
    console.log("DESTROYDESTROYDESTROY");
    //console.log(req.company);
    // create a new variable to hold the company that was placed on the req object.
    var company = req.company;

    company.destroy().then(function(){
        console.log("MADEITTHISFAR");
        return res.jsonp(company);
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


