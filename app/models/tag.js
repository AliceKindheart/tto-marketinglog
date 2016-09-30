'use strict';

module.exports = function(sequelize, DataTypes) {

	var Tag = sequelize.define('Tag', {
			Tag_name: DataTypes.STRING,
			tags_id: DataTypes.INTEGER
		}
	);

	return Tag;
};
