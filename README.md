# Tyk.io Dashboard API Wrapper 0.0.3

This module is to wrap the Tyk.io Dashboard API calls into an easy to use node.js module.
Thus far I've only got the Portal Key Request verbs covered. More to come.

### Test Coverage
Env vars needed from your tyk instance:
- TYK_APIKEY: an admin user's dashboard API key
- TYK_PLANID: an existing plan/policy Id to create test key reqs with
- TYK_USERID: an existing develop user Id to create test key reqs with

Plan/policy and user ids can be grabbed off the tyk dashboard's URL.
