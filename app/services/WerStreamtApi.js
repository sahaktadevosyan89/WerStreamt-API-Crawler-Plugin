'use strict';

const superagent = require('superagent');
let config = require('config/config');

class WerStreamtApi {

    constructor () {
        this.reqCount = 0;
        this.successResponse = 0,
        this.emptyStreamResponse = 0;
        this.lessData = 0,
        this.emptyResponse = 0,
        this.errorResponse = 0;
    }

    getStreamProvider() {
        return new Promise(function (resolve, reject) {
            superagent
                .get(config.apiUrl + '/getStreamProviders')
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if(res && res.statusCode === 200) {
                        resolve(res.body.response.Items);
                    }
                });
        });
    }

    lookupService(result, index, resultsLength) {
        let vm = this;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                vm.reqCount++;
                process.stdout.write('\x1Bc');
                process.stdout.write('Start crawling WerStreamt.es\n');
                process.stdout.write('Request count: ' + vm.reqCount + ' ' +  Math.round(vm.reqCount / resultsLength * 100) + '%\n');
                process.stdout.write('Success: ' + vm.successResponse + ' ' +  Math.round(vm.successResponse / vm.reqCount * 100) + '%\n');
                process.stdout.write('Found with empty Stream: ' + vm.emptyStreamResponse + ' ' +  Math.round(vm.emptyStreamResponse / vm.reqCount * 100) + '%\n');
                process.stdout.write('Missing year: ' + vm.lessData  + ' ' +  Math.round(vm.lessData / vm.reqCount * 100) + '%\n');
                process.stdout.write('Empty response: ' + vm.emptyResponse  + ' ' +  Math.round(vm.emptyResponse / vm.reqCount * 100) + '%\n');
                process.stdout.write('Error response: ' + vm.errorResponse  + ' ' +  Math.round(vm.errorResponse / vm.reqCount * 100) + '%\n');


                let imdb, movie, item;
                if(result.dataValues && result.dataValues.movie && result.dataValues.movie.item) {
                    imdb = result.dataValues;
                    movie = imdb.movie;
                    item = movie.item;

                    if(item.type && movie.year && item.name_en) {
                        let query = {
                            'type': item.type,
                            'year': movie.year,
                            'titles[]': item.name_en
                        };
                         superagent
                            .get(config.apiUrl + '/lookup')
                            .query(query)
                            .set('Accept', 'application/json')
                            .end(function (err, res) {
                                if(res && res.statusCode === 200 && res.body.response.length > 0) {
                                    resolve(res.body.response[0]);
                                } else if(res && res.statusCode === 200 && res.body.response.length === 0) {
                                    vm.emptyResponse++;
                                } else if(res && res.statusCode !== 200) {
                                    vm.errorResponse++;
                                }
                            });
                    } else {
                        vm.lessData++;
                    }
                } else {
                    vm.lessData++;
                }


            }, config.delay * index);
        });
    }

    getDetails(contentId) {
        let vm = this;
        return new Promise(function (resolve, reject) {
            superagent
                .get(config.apiUrl + '/getDetails')
                .query({
                    ContentID: contentId
                })
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if(res && res.statusCode === 200 && res.body.response) {
                        let contentData = res.body.response;

                        if (contentData.Streams && contentData.Streams.length > 0) {
                            vm.successResponse++;
                            resolve(contentData);
                        } else {
                            vm.emptyStreamResponse++;
                            resolve();
                        }
                    }  else if(res && res.statusCode === 200 && res.body.response.length === 0) {
                        vm.emptyResponse++;
                    }  else if(res && res.statusCode !== 200) {
                        vm.errorResponse++;
                    }
                });
        });
    }

    getStreamList(contentId, providerId) {
        return new Promise(function (resolve, reject) {
            superagent
                .get(config.apiUrl + '/getStreams')
                .query({
                    ContentID: contentId,
                    ProviderID: providerId
                })
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if(res && res.statusCode === 200 && res.body.response) {
                        resolve(res.body.response);
                    }
                });
        });
    }
}


module.exports = new WerStreamtApi();
