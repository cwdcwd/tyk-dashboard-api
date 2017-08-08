'use strict';

const config = {};

config.APIKEY = process.env.TYK_APIKEY || '';
config.PLANID = process.env.TYK_PLANID || '';
config.USERID = process.env.TYK_USERID || '';

module.exports = config;
