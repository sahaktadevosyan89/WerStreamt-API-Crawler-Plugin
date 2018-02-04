'use strict';

const WerStreamtApi = require('services/WerStreamtApi'),
      BaseService = require('services/BaseService'),
      db = require('models/index');

class MovieService extends BaseService {

    constructor(streamProvidersMap) {
        super(streamProvidersMap);
    }

    /**
     * Save movie item with related streams and offers
     *
     * @param {Object} contentData
     */
    save(contentData) {
        return super.createItem(contentData)
            .spread((item, created) => {
                if(created) {
                    return db.Movie
                        .create({
                            item_id: item.get('id'),
                            year: contentData.Year
                        })
                        .then((movie) => {
                            return super.saveStreamList(contentData.Streams, item.get('id'));
                        });
                } else {
                    return Promise.resolve(true);
                }
            })

    }

}

    module.exports = MovieService;
