/* eslint-env node, mocha */
/* eslint no-unused-expressions: 0 */
/* eslint func-names: 0 */
/* eslint no-invalid-this: 0 */

'use strict';

const _ = require('lodash');
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

  it('create, update & delete developer', (done) => {
    tyk.developers.create({email: config.USER_EMAIL}, (err, res) => {
      expect(err).to.not.exist;
      expect(res.statusCode).to.equal(HTTP_SUCCESS);
      expect(res).to.exist;

      const dev = JSON.parse(res.body);
      const devId = _.get(dev, 'Message', '');

      tyk.developers.update(devId, {
        id: devId,
        email: config.USER_EMAIL,
        fields: {
          Country: 'US'
        }
      }, (updateErr, updateRes) => {
        expect(updateErr).to.not.exist;
        expect(updateRes.statusCode).to.equal(HTTP_SUCCESS);
        expect(updateRes).to.exist;

        tyk.developers.delete(devId, (deleteErr, deleteRes) => {
          expect(deleteErr).to.not.exist;
          expect(deleteRes.statusCode).to.equal(HTTP_SUCCESS);
          expect(deleteRes).to.exist;
          done();
        });
      });
    });
  });
});
