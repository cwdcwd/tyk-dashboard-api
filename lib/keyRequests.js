'use strict';

const _ = require('lodash');

const TYK_API_V = 'v2';


/**
 * KeyRequests - key request handler
 *
 * @param  {object} parent overarching module object
 */
function KeyRequests(parent) {
  this.parent = parent;
}

KeyRequests.prototype.get = function getKeyRequests(iId, cb) {
  const self = this;

  if (_.isFunction(iId)) {
    cb = iId;
    iId = '';
  }

  const reqObj = {
    url: `${self.parent.tykConfig.baseURL}/api/portal/requests/${iId}`,
    headers: {Authorization: self.parent.tykConfig.authorization}
  };

  self.parent.callOut(reqObj, cb);
};

KeyRequests.prototype.approve = function approveKeyRequest(iId, cb) {
  const self = this;

  if (iId) {
    const reqObj = {
      url: `${self.parent.tykConfig.baseURL}/api/portal/requests/approve/${iId}`,
      headers: {Authorization: self.parent.tykConfig.authorization},
      method: 'PUT'
    };

    self.parent.callOut(reqObj, cb);
  } else {
    throw new Error('id value required');
  }
};

KeyRequests.prototype.create = function createKeyRequest(planId, userId, fields, cb) {
  const self = this;

  if (planId && userId) {
    if (_.isFunction(fields)) {
      cb = fields;
      fields = {};
    }

    const reqObj = {
      url: `${self.parent.tykConfig.baseURL}/api/portal/requests/`,
      headers: {Authorization: self.parent.tykConfig.authorization},
      method: 'POST',
      body: JSON.stringify({
        by_user: userId,
        date_created: (new Date()).toISOString(),
        for_plan: planId,
        version: TYK_API_V,
        fields
      })
    };

    self.parent.callOut(reqObj, cb);
  } else {
    throw new Error('planId and userId values required');
  }
};

KeyRequests.prototype.delete = function deleteKeyRequest(iId, cb) {
  const self = this;

  if (iId) {
    const reqObj = {
      url: `${self.parent.tykConfig.baseURL}/api/portal/requests/${iId}`,
      headers: {Authorization: self.parent.tykConfig.authorization},
      method: 'DELETE'
    };

    self.parent.callOut(reqObj, cb);
  } else {
    throw new Error('id value required');
  }
};

module.exports = KeyRequests;
