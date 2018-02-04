'use strict';

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('movies', {
        item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
		year: DataTypes.INTEGER,
		length: DataTypes.INTEGER,
		trailer_en: DataTypes.STRING(150),
		trailer_de: DataTypes.STRING(150)
	}, {
		instanceMethods: {
			toJSON: function () {
				return this.get();
			}
		}
	});
};
