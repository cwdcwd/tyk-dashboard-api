'use strict';

const _ = require('lodash');


/**
 * Developers - developer endpoint handler
 *
 * @param  {object} parent overarching module object
 */
function Developers(parent) {
  this.parent = parent;
}

Developers.prototype.get = function getDevelopers(iId, cb) {
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

Developers.prototype.getByAPI = function getByAPI(apiID, cb) {
  const self = this;

  if (apiID) {
    const reqObj = {
      url: `${self.parent.tykConfig.baseURL}/api/portal/developers/api/${apiID}`,
      headers: {Authorization: self.parent.tykConfig.authorization}
    };

    self.parent.callOut(reqObj, cb);
  } else {
    throw new Error('api id value required');
  }
};

Developers.prototype.delete = function deleteDeveloper(iId, cb) {
  const self = this;

  if (iId) {
    const reqObj = {
      url: `${self.parent.tykConfig.baseURL}/api/portal/developers/${iId}`,
      headers: {Authorization: self.parent.tykConfig.authorization},
      method: 'DELETE'
    };

    self.parent.callOut(reqObj, cb);
  } else {
    throw new Error('id value required');
  }
};


/**
 * UpdateDeveloper - create or update a developer
 *
 * @param  {number} iId         description
 * @param  {object} userDetails description
 * @param  {function} cb          description
 */
function UpdateDeveloper(iId, userDetails, cb) {
  const self = this;

  if (_.isFunction(userDetails)) {
    cb = userDetails;
    userDetails = iId;
    iId = null;
  }

  if (!userDetails.email) { // CWD-- required by tyk everytime, apparently
    throw new Error('user email required');
  }

  if (userDetails) {
    const userPayload = {email: userDetails.email};

    if (iId) {
      userPayload.id = iId;
    } else {
      iId = '';
    }

    if (userDetails.fields) {
      userPayload.fields = userDetails.fields;
    }

    if (_.isBoolean(userDetails.inactive)) {
      userPayload.inactive = userDetails.inactive;
    }

    if (userDetails.api_keys) {
      userPayload.api_keys = userDetails.api_keys;
    }

    if (userDetails.subscriptions) {
      userPayload.subscriptions = userDetails.subscriptions;
    }

    const method = userPayload.id ? 'PUT' : 'POST'; // CWD-- no user id? must be a create then

    const reqObj = {
      url: `${self.parent.tykConfig.baseURL}/api/portal/developers/${iId}`,
      headers: {Authorization: self.parent.tykConfig.authorization},
      method,
      body: JSON.stringify(userPayload)
    };

    self.parent.callOut(reqObj, cb);
  } else {
    throw new Error('user detail values required');
  }
}

Developers.prototype.update = UpdateDeveloper;
Developers.prototype.create = UpdateDeveloper;

module.exports = Developers;
