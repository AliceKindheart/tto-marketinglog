'use strict';


var StandardError = require('standard-error');
var db = require('../../config/sequelize');

exports.listtags = function(req, res) {
    console.log("LISTTAGS RAN");
    db.Tag.findAll()
    	.then(function(tags){
        	return res.jsonp(tags);
    	}).catch(function(err){
    		return res.render('error', {
   	         	error: err,
            	status: 500
        	});
    	});
};

