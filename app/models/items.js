'use strict';

var ITEM_TYPE = require('helpers/item_type');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('items', {
        hummingbird_id: DataTypes.INTEGER,
		wses_id: DataTypes.INTEGER,
        type: DataTypes.ENUM(
	        ITEM_TYPE.BOOK,
	        ITEM_TYPE.MOVIE,
	        ITEM_TYPE.TVSHOW,
	        ITEM_TYPE.TVSHOW_SEASON,
	        ITEM_TYPE.TVSHOW_EPISODE
        ),
        active: DataTypes.BOOLEAN,
	    name_de: DataTypes.STRING(200),
	    name_en: DataTypes.STRING(200),
	    name_es: DataTypes.STRING(200),
	    name_fr: DataTypes.STRING(200),
	    name_pt: DataTypes.STRING(200),
	    descr_de: DataTypes.STRING(1000),
	    descr_en: DataTypes.STRING(1000),
	    descr_es: DataTypes.STRING(1000),
	    descr_fr: DataTypes.STRING(1000),
	    descr_pt: DataTypes.STRING(1000)
    }, {
        instanceMethods: {
	        getLocalizedName: function (language) {
		        var fallback = this.name_en || this.name_de || '';

		        if (language === 'de' && this.name_de) {
			        return this.name_de;
		        }
		        if (language === 'en' && this.name_en) {
			        return this.name_en;
		        }
		        return fallback;
	        },

            toJSON: function () {
                return this.get();
            }
        }
    });
};
