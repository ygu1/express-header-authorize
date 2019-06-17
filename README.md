# express-header-authorize
This module provides the express header authorize with basic auth and OIDC accesstoken.

## Install

    $ npm install express-header-authorize

## Usage

### Example
```
import Authorize from 'express-header-authorize';

const authorize = new Authorize({
  accesstokenConfig: {
    url: <OIDC introspection url>,
    clientId: <OIDC client ID>,
    clientSecret: <OIDC client Secret>,
  },
  ldapConfig: {
    url: <LDAP url (ldaps://ldap.com:636)>,
    searchBase: <LDAP searchBase (ou=ldap,o=ldap.com))>,
    searchFilter: <LDAP searchFilter (mail={{username}})>,
  },
});

// authorize with basic auth header
authorize.authorizeWithBasicAuth('Basic XXXX')
.then((user) => {
  if(user.active) {
    // user authorize passed
  } else {
    // user authorize failed
  }
});

// authorize with accesstoken
authorize.authorizeWithAccesstoken('XXXXXXXXXX')
.then((user) => {
  if(user.active) {
    // user authorize passed
  } else {
    // user authorize failed
  }
});

// authorize with header
authorize.authorizeWithHeader(header)
.then((user) => {
  if(user.active) {
    // user authorize passed
  } else {
    // user authorize failed
  }
});
```
