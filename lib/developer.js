'use strict';

const _ = require('lodash');

function Developers(parent) {
  this.parent = parent;
}

Developers.prototype.get = function getDevelopers(iId, cb) {
  const self = this;
console.log(this);
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

module.exports = Developers;
