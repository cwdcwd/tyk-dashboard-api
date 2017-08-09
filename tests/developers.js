/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0 */
/* eslint func-names: 0 */
/* eslint no-invalid-this: 0 */

'use strict';

const expect = require('chai').expect;
const TykDashboardAPI = require('../index');
const config = require('./test_config');

const HTTP_SUCCESS = 200;
const HTTP_NOAUTH = 401;
const MOCHA_TIMEOUT = 15000;

describe('tyk developers negative', function () {
  this.timeout(MOCHA_TIMEOUT);

  const tyk = new TykDashboardAPI();

  it('fetch developers with no auth', (done) => {
    tyk.developers.get((err, res) => {
      expect(err).to.exist;
      expect(err.statusCode).to.equal(HTTP_NOAUTH);
      expect(res).to.not.exist;
      console.log(err);
      console.log(res);
      done();
    });
  });
});

describe('tyk developers positive', function () {
  this.timeout(MOCHA_TIMEOUT);

  const tyk = new TykDashboardAPI({authorization: config.APIKEY});
  it('fetch developers', (done) => {
    tyk.developers.get((err, res) => {
      expect(err).to.not.exist;
      expect(res.statusCode).to.equal(HTTP_SUCCESS);
      expect(res).to.exist;
      done();
    });
  });
});
