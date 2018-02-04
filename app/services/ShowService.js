'use strict';

const WerStreamtApi = require('services/WerStreamtApi'),
      BaseService = require('services/BaseService'),
      db = require('models/index');

class ShowService extends BaseService {

    constructor(streamProvidersMap) {
        super(streamProvidersMap);
    }

    /**
    * Save show item with related streams and offers
    *
    * @param {object} contentData
    * @returns {Promise}
    */
    save(contentData, streamProvidersMap) {
        return super.createItem(contentData)
            .spread((item, created) => {
                if(created) {
                    return db.Show
                        .create({
                            item_id: item.get('id'),
                            year_start: contentData.Year
                        })
                        .then((show) => {
                            if(contentData.StreamSummary) {
                                return getProviderIds(contentData.StreamSummary, streamProvidersMap)
                                    .then((providerIds) => {
                                        getStreamList(contentData.ID, providerIds)
                                            .then((streamList) => {
                                                return super.saveStreamList(streamList, show.get('item_id'));
                                            })
                                    });
                            } else {
                                return Promise.resolve(true);
                            }
                        });
                } else {
                    return Promise.resolve(true);
                }
            });
    }

    /**
     * Retreive all streams from API by given provider ids and contentId
     *
     * @param {Number} contentId
     * @param {Object[]} providerIds
     * @returns {Promise}
     */
    getStreamList(contentId, providerIds) {
        let promises =  providerIds.map((providerId) => {
          return WerStreamtApi.getStreamList(contentId, providerId);
        });

        return Promise
            .all(promises)
            .then((streamList) => {
                return Promise.resolve(streamList);
            });
    }

    /**
     * streamSummary object contains providers titles from which we need to convert and get providers ids
     *
     * @param {Object} streamSummary
     * @param {Object} streamProvidersMap
     * @returns {Promise}
     */
    getProviderIds(streamSummary, streamProvidersMap) {
        let searchedProviderIds = [];

        for(let index in streamSummary) {
            if(streamProvidersMap[streamSummary[index].ProviderTitle]) {
                searchedProviderIds.push(streamProvidersMap[streamSummary[index].ProviderTitle]);
            }
        }

        return Promise.resolve(searchedProviderIds);
    }
}

module.exports = ShowService;
