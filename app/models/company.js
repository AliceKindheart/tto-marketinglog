'use strict';

module.exports = function(sequelize, DataTypes) {

	var Company = sequelize.define('Company', {	
			Company_name: DataTypes.STRING,
			Notes: DataTypes.STRING,
		},	
		{
			associate: function(models) {
					Company.belongsToMany(models.Tag, {through: 'CompanyTags'});
					Company.belongsToMany(models.Contact, {through: 'CompanyEvents'});
					Company.belongsToMany(models.Event, {through: 'CompanyEvents'});
			}
		}
	);

	return Company;
};