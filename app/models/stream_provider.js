'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('stream_provider', {
        name: DataTypes.STRING(200),
        wses_provider_id: DataTypes.INTEGER

    }, {
        instanceMethods: {
            toJSON: function () {
                return this.get();
            }
        }
    });
};
