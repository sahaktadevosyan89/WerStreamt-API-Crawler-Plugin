'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tvshows', {
		item_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: 'items',
				referencesKey: 'id'
			}
		},
        year_start: DataTypes.INTEGER,
        year_end: DataTypes.INTEGER,
        length: DataTypes.INTEGER,
        thetvdb_key: DataTypes.STRING(45),
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
