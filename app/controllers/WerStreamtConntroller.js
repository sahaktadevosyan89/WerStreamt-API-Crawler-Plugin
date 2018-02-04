'use strict';

const WerStreamtApi = require('services/WerStreamtApi'),
      MovieService = require('services/MovieService'),
      ShowService = require('services/ShowService'),
      BaseService = require('services/BaseService');

let config = require('config/config'),
    ITEM_TYPE = require('helpers/item_type');

const itemTypes = {
    Show: ITEM_TYPE.TVSHOW,
    Movie: ITEM_TYPE.MOVIE
};

/**
 *  Start
 */
class WerStreamtCrawler {
    start() {
        // console.log('Start crawling WerStreamt.es');
        return BaseService
            .getStreamProviders()
            .then(function (streamProvidersMap) {
                let promises = [],
                    movieService = new MovieService(streamProvidersMap),
                    showService = new ShowService(streamProvidersMap);
                return BaseService
                            .getItems()
                            .then(function (items) {
                                let itemsLength = items.length;

                                let promises = items.map((item) => {
                                    return WerStreamtApi
                                        .lookupService(items[i], i, itemsLength)
                                        .then(function (data) {
                                            return WerStreamtApi
                                                .getDetails(data.ID);
                                        })
                                        .then(function (contentData) {
                                            if (contentData) {
                                                if(itemTypes[contentData.Type] === ITEM_TYPE.MOVIE) {
                                                    return movieService.save(item, contentData);
                                                } else if (itemTypes[contentData.Type] === ITEM_TYPE.TVSHOW) {
                                                    return showService.save(contentData);
                                                }
                                            }
                                        });
                                });

                                return Promise.all(promises);
                            })


            })
            .then(function () {
                console.log('Finished!');
            })
            .catch(function (err) {
                console.log('Error: ' + err);
            });
    }
};

module.exports = new WerStreamtCrawler();
