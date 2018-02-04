'use strict';

var OFFER_TYPE = require('helpers/item_type');
var FORMAT_TYPE = require('helpers/item_type');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('stream_offer', {
        stream_id: DataTypes.INTEGER,
        price: DataTypes.STRING(10),
        currency: DataTypes.STRING(5),
        type: DataTypes.ENUM(
            OFFER_TYPE.FREE,
            OFFER_TYPE.FLATRATE,
            OFFER_TYPE.PURCHASE,
            OFFER_TYPE.RENTAL
        ),
        format: DataTypes.ENUM(
            FORMAT_TYPE.SD,
            FORMAT_TYPE.HD
        ),
        flatrate_title: DataTypes.STRING(100)
    }, {
        instanceMethods: {
            toJSON: function () {
                return this.get();
            }
        }
    });
};