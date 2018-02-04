'use strict';

let config = require('config/config'),
    Sequelize = require('sequelize');


let sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    {
        host: config.db.host,
        port: config.db.port,
        define: {
            underscored: true,
            freezeTableName: true,
            timestamps: false
        },
        logging: false
    }
);

let Item = sequelize.import(__dirname + '/items'),
    Movie = sequelize.import(__dirname + '/movies'),
    TvShow = sequelize.import(__dirname + '/tvshows'),
    Stream = sequelize.import(__dirname + '/stream'),
    StreamProvider = sequelize.import(__dirname + '/stream_provider'),
    StreamOffer = sequelize.import(__dirname + '/stream_offer'),
    ImdbEntry = sequelize.import(__dirname + '/imdb_entries');

Item.hasOne(Movie, { foreignKey: 'item_id' });
Item.hasOne(TvShow, { foreignKey: 'item_id' });
Item.hasMany(Stream, { foreignKey: 'item_id' });

ImdbEntry.hasOne(Movie, { foreignKey: 'imdb_entry_id' });
ImdbEntry.hasOne(TvShow, { foreignKey: 'imdb_entry_id' });

Movie.belongsTo(ImdbEntry, { foreignKey: 'imdb_entry_id' });

TvShow.belongsTo(ImdbEntry, { foreignKey: 'imdb_entry_id' });

Movie.belongsTo(Item, { foreignKey: 'item_id' });

TvShow.belongsTo(Item, { foreignKey: 'item_id' });

Stream.belongsTo(Item, { foreignKey: 'item_id' });
Stream.hasMany(StreamOffer, { foreignKey: 'stream_id' });
Stream.belongsTo(StreamProvider, { foreignKey: 'stream_provider_id' });

StreamProvider.hasMany(Stream, { foreignKey: 'stream_provider_id' });

StreamOffer.belongsTo(Stream, { foreignKey: 'stream_id' });

module.exports = {
    sequelize: sequelize,
    Item: Item,
    Movie: Movie,
    TvShow: TvShow,
    ImdbEntry: ImdbEntry,
    Stream: Stream,
    StreamProvider: StreamProvider,
    StreamOffer: StreamOffer
};
