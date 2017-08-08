'use strict';

const _ = require('lodash');
const requestPromise = require('request-promise');

const HTTP_SUCCESS = 200;
const TYK_API_V = 'v2';

/**
 * callOut - fire request over
 *
 * @param  {object} reqObj request details
 * @param  {function} cb     callback
 */
function callOut(reqObj, cb) {
  reqObj.resolveWithFullResponse = true;
  reqObj.simple = false;
  console.log(reqObj);
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
}

TykDashboardAPI.prototype.getKeyRequests = function getKeyRequests(iId, cb) {
  const self = this;

  if (_.isFunction(iId)) {
    cb = iId;
    iId = '';
  }

  const reqObj = {
    url: `${self.tykConfig.baseURL}/api/portal/requests/${iId}`,
    headers: {Authorization: self.tykConfig.authorization}
  };

  callOut(reqObj, cb);
};

TykDashboardAPI.prototype.approveKeyRequest = function approveKeyRequest(iId, cb) {
  const self = this;

  if (iId) {
    const reqObj = {
      url: `${self.tykConfig.baseURL}/api/portal/requests/approve/${iId}`,
      headers: {Authorization: self.tykConfig.authorization},
      method: 'PUT'
    };

    callOut(reqObj, cb);
  } else {
    throw new Error('id value required');
  }
};

TykDashboardAPI.prototype.createKeyRequest = function createKeyRequest(planId, userId, fields, cb) {
  const self = this;

  if (planId && userId) {
    if (_.isFunction(fields)) {
      cb = fields;
      fields = {};
    }

    const reqObj = {
      url: `${self.tykConfig.baseURL}/api/portal/requests/`,
      headers: {Authorization: self.tykConfig.authorization},
      method: 'POST',
      body: JSON.stringify({
        by_user: userId,
        date_created: (new Date()).toISOString(),
        for_plan: planId,
        version: TYK_API_V,
        fields
      })
    };

    callOut(reqObj, cb);
  } else {
    throw new Error('planId and userId values required');
  }
};

TykDashboardAPI.prototype.deleteKeyRequest = function deleteKeyRequest(iId, cb) {
  const self = this;

  if (iId) {
    const reqObj = {
      url: `${self.tykConfig.baseURL}/api/portal/requests/${iId}`,
      headers: {Authorization: self.tykConfig.authorization},
      method: 'DELETE'
    };

    callOut(reqObj, cb);
  } else {
    throw new Error('id value required');
  }
};

module.exports = TykDashboardAPI;
