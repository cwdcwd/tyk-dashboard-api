'use strict';

const config = {};

config.APIKEY = process.env.TYK_APIKEY || '';
config.PLAN_ID = process.env.TYK_PLANID || '';
config.USER_ID = process.env.TYK_USER_ID || '';
config.USER_EMAIL = process.env.TYK_USER_EMAIL || '';

module.exports = config;
