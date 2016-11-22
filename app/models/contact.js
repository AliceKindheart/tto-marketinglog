'use strict';

module.exports = function(sequelize, DataTypes) {

	var Contact = sequelize.define('Contact', {
			Contact_name: DataTypes.STRING,
			Contact_title: DataTypes.STRING,
			Contact_email: DataTypes.STRING,
			Contact_phone: DataTypes.STRING,
			//Notes: DataTypes.STRING,
			Company_name: DataTypes.STRING,
			//contacts_id: DataTypes.INTEGER,
			//company_id: DataTypes.INTEGER
		},
		{
			associate: function(models) {
					Contact.belongsTo(models.Company, {through: "Company_name"});
			}
		}
	);

	return Contact;
};
