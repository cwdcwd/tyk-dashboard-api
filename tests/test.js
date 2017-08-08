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

describe('tyk key requests negative', function () {
  this.timeout(15000);

  const tyk = new TykDashboardAPI();

  it('fetch key requests with no auth', (done) => {
    tyk.getKeyRequests((err, res) => {
      expect(err).to.exist;
      expect(err.statusCode).to.equal(HTTP_NOAUTH);
      expect(res).to.not.exist;
      done();
    });
  });
});

describe('tyk key requests positive', function () {
  this.timeout(15000);

  const tyk = new TykDashboardAPI({authorization: config.APIKEY});
  it('fetch key requests', (done) => {
    tyk.getKeyRequests((err, res) => {
      expect(err).to.not.exist;
      expect(res.statusCode).to.equal(HTTP_SUCCESS);
      expect(res).to.exist;
      done();
    });
  });

  it('create, approve, & delete key request', (done) => {
    tyk.createKeyRequest(config.PLANID, config.USERID, (err, res) => {
      expect(err).to.not.exist;
      expect(res.statusCode).to.equal(HTTP_SUCCESS);
      expect(res).to.exist;

      const keyReq = JSON.parse(res.body);
      const keyReqId = _.get(keyReq, 'Message', '');

      tyk.approveKeyRequest(keyReqId, (apprErr, appRes) => {
        expect(apprErr).to.not.exist;
        expect(appRes.statusCode).to.equal(HTTP_SUCCESS);
        expect(appRes).to.exist;
        console.log(`appRes.body: ${appRes.body}`);
        const body = JSON.parse(appRes.body);
        expect(body.RawKey).to.exist;

        tyk.deleteKeyRequest(keyReqId, (deleteErr, deleteRes) => {
          expect(deleteErr).to.not.exist;
          expect(deleteRes.statusCode).to.equal(HTTP_SUCCESS);
          expect(deleteRes).to.exist;
          done();
        });
      });
    });
  });

  it('fetch single key request', (done) => {
    tyk.getKeyRequests((err, res) => {
      expect(err).to.not.exist;
      expect(res.statusCode).to.equal(HTTP_SUCCESS);
      expect(res).to.exist;

      const keyReqs = JSON.parse(res.body);
      const data = _.get(keyReqs, 'Data', []);
      expect(data.length).to.not.equal(0);

      tyk.getKeyRequests(_.get(data[0], '_id', ''), (singleErr, singleRes) => {
        expect(singleErr).to.not.exist;
        expect(singleRes.statusCode).to.equal(HTTP_SUCCESS);
        expect(singleRes).to.exist;
        done();
      });
    });
  });
});
