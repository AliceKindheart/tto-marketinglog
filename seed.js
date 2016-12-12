var db = require ('./config/sequelize').sequelize;


console.log(db);
var Tag = db.model("Tag");
var Company = db.model("Company");
var Contact = db.model("Contact");
var Technology = db.model("Technology");

Tag.create({
	Tag_name: "Tag"
}).then(function(){
	console.log("SUCCESS!!!");
}).catch(function(err){
	console.log("ERROR", err);
})

Tag.create({
	Tag_name: "Shiny"
})

Tag.create({
	Tag_name: "Furry"
})

Tag.create({
	Tag_name: "Crunchy"
})

Tag.create({
	Tag_name: "Cute"
})

Tag.create({
	Tag_name: "Stripey"
})

Tag.create({
	Tag_name: "Orange"
})

Tag.create({
	Tag_name: "Fanged"
})

Company.create({
	Company_name: "Cute Cats R Us",
	Notes: "finicky and sometimes feisty"
})

Company.create({
	Company_name: "Coffee: Yes, Please!",
	Notes: "important"
})

Company.create({
	Company_name: "Pancakes, Flapjacks, and More",
	Notes: "syrup and butter"
})

Company.create({
	Company_name: "Chocolate for Chinchillas",
	Notes: "stupid idea for a company"
})

Contact.create({
	Contact_name: "Chippy Chinchilla",
	Contact_title: "Head Chinchilla",
	Contact_email: "chippy@chinchilla.net",
	Contact_phone: "555-234-5676"
})

Contact.create({
	Contact_name: "Jack Flap",
	Contact_title: "Head Flapjack",
	Contact_email: "jack@flap.net",
	Contact_phone: "555-244-5676"
})

Contact.create({
	Contact_name: "Kitty Cat",
	Contact_title: "Cutest cat on the internet",
	Contact_email: "cat@internet.net",
	Contact_phone: "555-234-5644"
})

Contact.create({
	Contact_name: "Whiskers",
	Contact_title: "Chief Napper",
	Contact_email: "whiskers@catcat.net",
	Contact_phone: "555-233-5676"
})

Technology.create({
	Tech_RUNumber: 495,
	Tech_name: "Grilled Cheese",
	Tech_inventor: "Mildred Monroe"
})

Technology.create({
	Tech_RUNumber: 376,
	Tech_name: "Cinnamon Rolls",
	Tech_inventor: "Crusty McDough"
})

Technology.create({
	Tech_RUNumber: 468,
	Tech_name: "Sliced Bread",
	Tech_inventor: "William Wonder"
})