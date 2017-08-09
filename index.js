'use strict';

const _ = require('lodash');
const requestPromise = require('request-promise');
const Developers = require('./lib/developers');
const KeyRequests = require('./lib/keyRequests');

const HTTP_SUCCESS = 200;

/**
 * callOut - fire request over
 *
 * @param  {object} reqObj request details
 * @param  {function} cb     callback
 */
function callOut(reqObj, cb) {
  reqObj.resolveWithFullResponse = true;
  reqObj.simple = false;
  // console.log(reqObj);
  const p = requestPromise(reqObj);
  p.then((resp) => {
    // console.log(resp);
    if (resp.statusCode !== HTTP_SUCCESS) {
      console.log(resp.statusCode, resp.body);
      return cb(resp);
    }

    return cb(null, resp);
  }).catch((err) => {
    console.log(err);
    console.log(err.body);
    cb(err);
  });
}


/**
 * TykDashboardAPI - base object
 *
 * @param  {object} tykConfig description
 */
function TykDashboardAPI(tykConfig) {
  const self = this;
  self.tykConfig = tykConfig || {baseURL: '', authorization: ''};

  self.tykConfig.baseURL = _.get(tykConfig, 'baseURL', 'https://admin.cloud.tyk.io');
  self.tykConfig.authorization = _.get(tykConfig, 'authorization', '');
  self.developers = new Developers(self);
  self.keyRequests = new KeyRequests(self);
}

TykDashboardAPI.prototype.callOut = callOut;

module.exports = TykDashboardAPI;
