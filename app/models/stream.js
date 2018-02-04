'use strict';

var STREAM_TYPE = require('helpers/stream_type');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('stream', {
        item_id:  DataTypes.INTEGER,
        languages: DataTypes.STRING(100),
        stream_provider_id: DataTypes.INTEGER,
        title: DataTypes.STRING(200),
        url: DataTypes.STRING(255),
        updated_at: DataTypes.DATE(),
        created_at: DataTypes.DATE(),
        wses_stream_id: DataTypes.INTEGER,
        type: DataTypes.ENUM(
            STREAM_TYPE.MovieStream,
            STREAM_TYPE.CollectionStream,
            STREAM_TYPE.SeasonStream,
            STREAM_TYPE.EpisodeStream
        )
    }, {
        instanceMethods: {
            toJSON: function () {
                return this.get();
            }
        }
    });
};