var db = require ('./config/sequelize').sequelize;

var Tag = db.model("Tag");
var Company = db.model("Company");
var Contact = db.model("Contact");
var Technology = db.model("Technology");
var User = db.model("User");

User.findOne({where: {name: 'Wonder Woman'}})
	.then(function(person){
		var person = person;
		Technology.create({
			Tech_RUNumber: 495,
			Tech_name: "Grilled Cheese",
			Tech_inventor: "Brie Muenster",
			isActive: true
		}).then(function(tech){
			tech.setUser(person);
		})
	})

User.findOne({where: {name: 'Wonder Woman'}})
	.then(function(prsn){
		var person = prsn;
		Technology.create({
			Tech_RUNumber: 376,
			Tech_name: "Cinnamon Rolls",
			Tech_inventor: "Crusty McDough",
			isActive: true
		}).then(function(tech){
			tech.setUser(person);
		})
	})

User.findOne({where: {name: "Wonder Woman"}})
	.then(function(pers){
		var person = pers;
		Technology.create({
			Tech_RUNumber: 468,
			Tech_name: "Sliced Bread",
			Tech_inventor: "William Wonder",
			isActive: true
		}).then(function(tec){
			tec.setUser(person);
		})
	})

