var db = require ('./config/sequelize').sequelize;
//var company;
//ar contact;

console.log(db);
var Tag = db.model("Tag");
var Company = db.model("Company");
var Contact = db.model("Contact");
var Technology = db.model("Technology");
var User = db.model("User");

//User.create({
//	name: 'Alice Kindheart',
//	email: 'akindheart@rockefeller.edu',
//	admin: true,
//	username: 'akindheart',
	//password: 'password',
//	provider: 'local',
//	hashedPassword: 'TnoZ3v4KtmcY/QAmXtq/Ng==',
//	salt: 'TnoZ3v4KtmcY/QAmXtq/Ng=='
//})

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
}).then(function(comp){
	var company = comp;
	Contact.create({
	Contact_name: "Ms. Rumplefur",
	Contact_title: "Cutest cat on the internet",
	Contact_email: "cat@internet.net",
	Contact_phone: "555-234-5644"
	}).then(function(contact){
		contact.setCompany(company);
		company.addContact(contact);
	})
})


Company.create({
	Company_name: "Cat Cat Cats",
	Notes: "full of fur"
}).then(function(company){
	var company=company;
	Contact.create({
		Contact_name: "Mr. Whiskerface",
		Contact_title: "Chief Napper",
		Contact_email: "whiskers@catcat.net",
		Contact_phone: "555-233-5676"
	}).then(function(contact){
		contact.setCompany(company);
		company.addContact(contact);
	})
})

Company.create({
	Company_name: "Coffee: Yes, Please!",
	Notes: "important"
}).then(function(comp){
	var company = comp;
	Contact.create({
		Contact_name: "Zippy the Squirrel",
		Contact_title: "Chief Coffee Drinker",
		Contact_email: "coffeecoffeebuzzbuzzbuzz@gmail.com",
		Contact_phone: "586-395-0395"
	}).then(function(contact){
		contact.setCompany(company);
		company.addContact(contact);
	})
})

Company.create({
	Company_name: "Pancakes, Flapjacks, and More",
	Notes: "syrup and butter"
	}).then(function(comp){
		var company = comp;
		Contact.create({
		Contact_name: "Flappy Jack Patterson",
		Contact_title: "Head Flapjack",
		Contact_email: "jack@flap.net",
		Contact_phone: "555-244-5676"
	}).then(function(contact){
		contact.setCompany(company);
		company.addContact(contact);
		company = "";
	})
})

Company.create({
	Company_name: "Chocolate for Chinchillas",
	Notes: "stupid idea for a company"
}).then(function(comp){
	var company = comp;
	Contact.create({
		Contact_name: "Chippy Chinchilla",
		Contact_title: "Head Chinchilla",
		Contact_email: "chippy@chinchilla.net",
		Contact_phone: "555-234-5676"
}).then(function(contact){
		contact.setCompany(company);
		company.addContact(contact);
		company = "";
	})
})


