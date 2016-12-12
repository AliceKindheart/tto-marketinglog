'use strict';

module.exports = function(sequelize, DataTypes) {

	var Contact = sequelize.define('Contact', {
			Contact_name: DataTypes.STRING,
			Contact_title: DataTypes.STRING,
			Contact_email: DataTypes.STRING,
			Contact_phone: DataTypes.STRING,
			//Contact_notes: DataTypes.STRING,
			//Company_name: DataTypes.STRING,
			//contacts_id: DataTypes.INTEGER,
			//company_id: DataTypes.INTEGER
		},
		{
			associate: function(models) {
					Contact.belongsTo(models.Company, {through: "CompanyContacts"}, {foreignKey: "id"});
					Contact.belongsToMany(models.Event, {through: "ContactEvents"}, {foreignKey: "id"});
			}
		}
	);

	return Contact;
};
