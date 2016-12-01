'use strict';

module.exports = function(sequelize, DataTypes) {

	var Tag = sequelize.define('Tag', {
			Tag_name: DataTypes.STRING,
			tags_id: DataTypes.INTEGER
		},
		{
			associate: function(models) {
					Tag.belongsToMany(models.Company, {through: 'CompanyTags'});
					Tag.belongsToMany(models.Technology, {through: 'TechTags'});
			}
		}

	);

	return Tag;
};
