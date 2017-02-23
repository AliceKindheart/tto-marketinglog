'use strict';

module.exports = function(sequelize, DataTypes) {

	var Event = sequelize.define('Event', {
			Event_date: DataTypes.DATE,
			Event_notes: DataTypes.STRING
		},
		{
			associate: function(models) {
					Event.belongsToMany(models.User, {through: 'UserEvents'});
					Event.belongsTo(models.Company, {through: 'CompanyEvents'});
					Event.belongsTo(models.Technology, {through: 'TechEvents'});
					Event.belongsTo(models.Contact, {through: 'ContactEvents'});
			}
		}

	);

	return Event;
};
