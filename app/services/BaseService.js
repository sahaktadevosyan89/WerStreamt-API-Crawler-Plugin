'use strict';

const WerStreamtApi = require('services/WerStreamtApi'),
      db = require('models/index');

let config = require('config/config'),
    STREAM_TYPE = require('helpers/stream_type'),
    OFFER_TYPE = require('helpers/offer_type'),
    FORMAT_TYPE = require('helpers/format_type');

class BaseService {

    constructor(streamProvidersMap) {
        this.streamProvidersMap = streamProvidersMap;
    }

    /**
     * Get all streamProviders and create or find from database
     *
     * @param {Object} contentData
     * @returns {Promise}
     */
    static getStreamProviders() {
        return WerStreamtApi
            .getStreamProvider()
            .then((_streamProviders) => {
                let providerPromises = _streamProviders.map((streamProvider) => {
                    return db.StreamProvider
                            .findOrCreate({
                                where: {
                                    wses_provider_id: streamProvider.ID
                                },
                                defaults: {
                                    name: streamProvider.Title,
                                    wses_provider_id: streamProvider.ID
                                }
                            })
                            .spread((provider) => {
                                return provider;
                            });
                });

                return Promise
                        .all(providerPromises);
            })
            .then((streamProviders) => {
                let streamProvidersMap = streamProviders.reduce((obj, streamProvider) => {
                    obj[streamProvider.get('name')] = streamProvider.get('id');

                    return obj;
                }, {});

                return streamProvidersMap;
            });
    }

    /**
     * Save item
     *
     * @param {Object} contentData
     * @returns {Promise}
     */
    createItem(contentData) {

        if (!contentData.Type ||
            !config.itemTypes[contentData.Type]) {
            return Promise.resolve(true);
        }

        return db.Item
            .findOrCreate({
                where : {
                    wses_id: contentData.ID
                },
                defaults: {
                    type: contentData.Type,
                    name_en: contentData.Title
                }
            });
    }

    /**
     * Save Item streams and related offers
     *
     * @param {Object[]} streamList
     * @param {Number} itemId
     * @returns {Promise}
     */
    saveStreamList(streamList, itemId) {
        if (streamList && Array.isArray(streamList)) {

            // Insert all streams
            let streamPromises = streamList.map((stream) => {
                return db.Stream
                        .create({
                            item_id: itemId,
                            languages: stream.Languages || '',
                            stream_provider_id: this.streamProvidersMap[stream.ProviderTitle],
                            title: stream.Title,
                            url: stream.Link,
                            updated_at: stream.Updated || new Date(),
                            created_at: new Date(),
                            wses_stream_id: stream.ID,
                            type: STREAM_TYPE[stream.Type]
                        })
                        .then((createdStream) => {
                            // Insert all offers connected with newly added stream
                            let streamOffersPromises = stream.Offers.map((offer) => {
                                return db.StreamOffer
                                        .create({
                                            stream_id: createdStream.get('id'),
                                            price: offer.Price || '',
                                            currency: offer.CurrencyCode || '',
                                            type: OFFER_TYPE[offer.Type],
                                            format: FORMAT_TYPE[offer.Format],
                                            flatrate_title: ''
                                        });
                            });

                            return Promise.all(streamOffersPromises);

                        });
            });

            return Promise.all(streamPromises);
        } else {
            return Promise.resolve(true);
        }
    }
    static getItems () {
        return db.ImdbEntry
                .findAll({
                        include: [{
                            model: db.Movie,
                            required: true,
                            include: [{
                                model: db.Item,
                                required: true
                            }]
                        }],
                        where: ['imdb_votes > ?', 1000],
                        order: [['imdb_average', 'DESC']],
                        limit: 10000
                })
    }

}

module.exports = BaseService;
