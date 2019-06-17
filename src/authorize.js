import rp from 'request-promise';
import passport from 'passport';
import Strategy from 'passport-ldapauth';

const ldapAuth = (username, password) => new Promise((resolve) => {
  passport.authenticate('ldapauth', (err, user) => {
    if (err || !user) {
      return resolve({ active: false });
    }
    return resolve(Object.assign({}, user, { active: true }));
  })({ query: { username, password } });
});

export default class Authorize {
  constructor({ ldapConfig, accesstokenConfig }) {
    // load ldap config
    if (ldapConfig) {
      if (!ldapConfig.url) throw new Error('Ldap configuration requires a url');
      if (!ldapConfig.searchBase) throw new Error('Ldap configuration requires a searchBase');
      if (!ldapConfig.searchFilter) throw new Error('Ldap configuration requires a searchFilter');
      this.ldapConfig = {
        url: ldapConfig.url,
        searchBase: ldapConfig.searchBase,
        searchFilter: ldapConfig.searchFilter,
      };
      const strategy = new Strategy({
        server: {
          url: this.ldapConfig.url,
          searchBase: this.ldapConfig.searchBase,
          searchFilter: this.ldapConfig.searchFilter,
        },
      });
      passport.use(strategy);
    } else {
      this.ldapConfig = null;
    }
    // load accesstoken config
    if (accesstokenConfig) {
      if (!accesstokenConfig.url) throw new Error('Accesstoken configuration requires a url');
      if (!accesstokenConfig.clientId) throw new Error('Accesstoken configuration requires a client ID');
      if (!accesstokenConfig.clientSecret) throw new Error('Accesstoken configuration requires a client secret');
      this.accesstokenConfig = {
        url: accesstokenConfig.url,
        clientId: accesstokenConfig.clientId,
        clientSecret: accesstokenConfig.clientSecret,
      };
    } else {
      this.accesstokenConfig = null;
    }
    if (!this.ldapConfig && !this.accesstokenConfig) throw new Error('Please provide at least one configuration');
  }

  async authorizeWithAccesstoken(accesstoken) {
    try {
      if (!this.accesstokenConfig) throw new Error('Please provide accesstoken configuration before use it');
      if (!accesstoken) throw new Error('Accesstoken cannot be empty');
      const option = {
        method: 'POST',
        url: this.accesstokenConfig.url,
        form: {
          token: accesstoken,
          client_id: this.accesstokenConfig.clientId,
          client_secret: this.accesstokenConfig.clientSecret,
        },
        json: true,
      };
      return await rp(option);
    } catch (e) {
      throw e;
    }
  }

  async authorizeWithBasicAuth(basicAuth) {
    try {
      if (!this.ldapConfig) throw new Error('Please provide ldap configuration before use it');
      if (!basicAuth) throw new Error('Basic Auth cannot be empty');
      const credentials = Buffer.from(basicAuth.split(' ')[1], 'base64').toString();
      const [username, password] = credentials.split(':');
      const data = await ldapAuth(username, password);
      return Object.assign({}, data, { sub: username });
    } catch (e) {
      throw e;
    }
  }

  async authorizeWithHeader(header) {
    try {
      if (!header) throw new Error('Please provide non empty header!');
      let response = {};
      if (header.accesstoken) {
        response = await this.authorizeWithAccesstoken(header.accesstoken);
      } else if (header.accessToken) {
        response = await this.authorizeWithAccesstoken(header.accessToken);
      } else if (header.access_token) {
        response = await this.authorizeWithAccesstoken(header.access_token);
      } else if (header.authorization) {
        response = await this.authorizeWithBasicAuth(header.authorization);
      } else {
        throw new Error('Please provide an header contains accesstoken or basic auth!');
      }
      return response;
    } catch (e) {
      throw e;
    }
  }
}
