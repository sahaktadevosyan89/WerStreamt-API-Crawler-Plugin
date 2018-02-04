'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('imdb_entries', {
        imdb_id: DataTypes.STRING(60),
        imdb_votes: DataTypes.INTEGER,
        imdb_average: DataTypes.FLOAT
    }, {
        instanceMethods: {
            toJSON: function () {
                return this.get();
            }
        }
    });
};
