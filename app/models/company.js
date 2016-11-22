'use strict';

module.exports = function(sequelize, DataTypes) {

	var Company = sequelize.define('Company', {	
			Company_name: DataTypes.STRING,
			Notes: DataTypes.STRING,
		},	
		//{
		//	timestamps: false,
		//	createdAt: false,
		//},
		{
			associate: function(models) {
					Company.belongsToMany(models.Tag, {through: 'CompanyTags'});
					Company.hasMany(models.Contact);
			}
		}
	);

	return Company;
};
